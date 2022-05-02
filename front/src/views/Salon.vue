<template>
    <Navbar :profileImage="profileImage" :username="username" />
    <div class="container" v-if="loggedInStatus">
        <form class="createPostField" enctype="multipart/form-data" id="formPost" ref="myForm" @submit.prevent="createPost">
            <div class="message error" v-if="error">{{ error }}</div>
            <textarea name="description" id="description" :placeholder="'Quoi de neuf, ' + username + ' ?'"></textarea>
            <div class="image-to-upload-block" v-if="imagePosted">
                <div class="delete-btn" @click="deleteImagePosted">Supprimer la photo</div>
                <img :src="imagePosted" alt="preview-image-to-upload" title="Image à publier">
            </div>
            <label for="postImage" class="fileLabel"><i class="fa-solid fa-image"></i> Ajouter une photo !</label>
            <input type="file" name="image" id="postImage" @change="showAddedImage">
            <button>Publier !</button>
        </form>

        <div class="content">
            <div class="post" v-for="post in posts" :key="post" :data-id="post.postId">
                <div class="post-header">
                    <div class="user-info">
                        <img :src="post.profileImage" alt="user-image" class="user-profile" title="Photo de profile">
                        <div class="name-date">
                            <router-link :to="{name: 'profile', params: { id: post.userId }}" class="username" title="Profile utilisateur">{{ post.username }}</router-link>
                            <p class="post-date">{{ post.postDate }}</p>
                        </div>
                    </div>
                    <i class="fa-solid fa-ellipsis" v-if="post.userId == connectedUserId || connectedUserStatus == 1" @click="showPostActions" title="Action du post"></i>
                    <div class="delete-edit-post hidden">
                        <div class="delete-post-btn post-action" @click="deletePost">
                            <i class="fa-solid fa-trash-can"></i>
                            <span>Supprimer cette publication</span>
                        </div>
                        <div class="edit-post-btn post-action" v-if="post.userId == connectedUserId" @click="showEditPost">
                            <i class="fa-solid fa-pen"></i>
                            <span>Modifier cette publication</span>
                        </div>
                    </div>
                </div>
                <div class="post-content">
                    <div class="post-desc" style="white-space: pre-line">
                        {{ post.postContent }}
                    </div>
                    <img :src="post.postImage" alt="post-image" class="post-image" v-if="post.postImage"  title="Image de publication">
                </div>
                <form class="edit-post hidden" @submit.prevent="editPost" enctype="multipart/form-data">
                    <textarea class="edit-desc" :value="post.postContent" name="editedDesc"></textarea>
                    <div class="image-block" :class="post.postImage ? '' : 'hidden'">
                        <div class="delete-btn" @click="deleteImage">Supprimer la photo</div>
                        <img :src="post.postImage" alt="post-img" class="post-image">
                    </div>
                    <label class="fileLabel" @click="focusInput"><i class="fa-solid fa-image"></i> Modifier/ Ajouter une photo !</label>
                    <input type="file" name="image" @change="showEditedImage">
                    <button class="edit-btn" @submit.prevent>Modifier !</button>
                </form>
                <div class="interactions-count">
                    <span class="likeCount">{{ post.likes }} J'aime</span>
                </div>
                <div class="post-interaction">
                    <div class="interaction like" :class="post.usersLiked.includes(connectedUserId) ? 'userLiked' : ''" @click="handleLike">
                        <i class="fa-solid fa-thumbs-up"></i>
                        <span>J'aime</span>
                    </div>
                    <label class="interaction comment" @click="toggleCommentSection">
                        <i class="fa-solid fa-message"></i>
                        <span for="comment">Commentaires</span>
                    </label>
                </div>
                <section class="comment-section">
                    <form class="new-comment" @submit.prevent="createComment">
                        <img :src="profileImage" alt="user-img" class="user-profile" title="Photo de profile">
                        <input type="text" name="comment" id="comment" placeholder="Ajouter un commentaire public !" autocomplete="off">
                        <button class="submit-btn"><i class="fa-solid fa-paper-plane"></i></button>
                    </form>
                    <div class="message error">{{ commentError }}</div>
                    <div class="comments" v-for="comment in comments" :key="comment">
                        <div class="one-comment" v-if="post.postId == comment.postId" :data-id="comment.commentId">
                            <div class="comment-content-profile-handleCommentActions">
                                <img :src="comment.profileImage" alt="user-img" class="user-profile" title="Photo de profile">
                                <div class="comment-content">
                                    <router-link :to="{name: 'profile', params: { id: comment.userId }}" class="username" title="Profile utilisateur">{{ comment.username }}</router-link>
                                    <div class="comment-message">{{ comment.commentContent }}</div>
                                </div>
                                <div class="comment-actions">
                                    <i class="fa-solid fa-trash" v-if="comment.userId == connectedUserId || connectedUserStatus == 1" @click="deleteComment" title="Supprimer le commentaire"></i>
                                    <i class="fa-solid fa-pen" v-if="comment.userId == connectedUserId" @click="showEditCommentForm" title="Modifier le commentaire"></i>
                                </div>
                            </div>
                            <span class="comment-date">{{ comment.commentDate }}</span>
                            <form id="editComment" class="hidden" @submit.prevent="editComment">
                                <input type="text" :placeholder="comment.commentContent" autocomplete="off">
                                <button class="btn-modifier">Modifier</button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import Axios from 'axios';
import moment from 'moment';
const urlApi = 'http://localhost:3333';

export default {
    name: 'Salon',
    components: {Navbar},
    data() {
        return {
            loggedInStatus: false,
            id: '',
            username: '',
            email: '',
            profileImage: '',
            admin: '',
            imagePosted: '',
            posts: [],
            connectedUserId: '',
            connectedUserStatus: 0,
            comments: [],
            deletePostImage: false,
            error: '',
            commentError: '',
        }
    },
    mounted() {
        const body = document.querySelector('body');
        body.style.background = '#F0F2F5'
        body.style.setProperty('--onAnotherPages', 'relative');
        const connectedUserId  = localStorage.getItem('userId');
        const connectedUserStatus = localStorage.getItem('admin');
        this.connectedUserId = connectedUserId;
        this.connectedUserStatus = connectedUserStatus;

        const userId = JSON.parse(localStorage.getItem('userId'));
        if (userId) {
            const token = localStorage.getItem('token');
            this.loggedInStatus = true;

            Axios.get(urlApi + `/user/${userId}`)
            .then((res) => {
                const user = res.data;
                this.id = user.id;
                this.username = user.username
                this.profileImage = user.profileImage;
            })
            .catch((err) => {
                console.log(err);
                if (err.response) {
                    this.error = err.response.data.error;
                } else {
                    this.error = "ERREUR SERVEUR ! Veuillez réessayer ultérieument !"
                }
            });
            
            this.getAllPosts(token);
            this.getAllComments(token);

        } else {
            this.loggedInStatus = false
            this.$router.push("/");
        }
    },
    unmounted() {
        const body = document.querySelector('body');
        body.style.background = ""
        body.style.setProperty('--onAnotherPages', 'absolute')
    },
    methods: {
        showAddedImage(e) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result
                this.imagePosted = img.src
            }
            reader.readAsDataURL(e.target.files[0]);
        },
        createPost() {
            const formPost = document.getElementById('formPost');
            let data = new FormData(formPost);
            const token = localStorage.getItem('token');
            
            Axios.post(urlApi + '/posts', data, {
                headers: {
                    "authorization": 'Bearer ' + JSON.parse(token),
                }
            })
            .then((res) => {
                this.getAllPosts(token);
                this.error = '';
            })
            .catch((err) => {
                console.log(err);
                if (err.response) {
                    this.error = err.response.data.error;
                } else {
                    this.error = "ERREUR SERVEUR ! Veuillez réessayer ultérieument !"
                }
            })

            this.$refs.myForm.reset();
            this.imagePosted = '';
        },
        showPostActions(e) {
            e.target.nextSibling.classList.toggle('hidden');
        },
        deletePost(e) {
            const postId = e.target.closest('div.post').getAttribute('data-id')
            const token = localStorage.getItem('token');
            Axios.delete(urlApi + `/posts/${postId}`, {
                headers: {
                    "authorization": 'Bearer ' + JSON.parse(token),
                }
            })
            .then((res) => {
                if (res) {
                    this.getAllPosts(token);
                }
            })
            .catch((err) => {
                console.log(err);
                if (err.response) {
                    this.error = err.response.data.error;
                } else {
                    this.error = "ERREUR SERVEUR ! Veuillez réessayer ultérieument !"
                }
            })
        },
        showEditPost(e) {
            e.target.closest('div.post-header').nextSibling.classList.toggle('hidden');
            e.target.closest('div.post-header').nextSibling.nextSibling.classList.toggle('hidden');
            e.target.closest('div.delete-edit-post').classList.toggle('hidden');
        },
        deleteImage(e) {
            e.target.nextSibling.setAttribute('src', '');
            e.target.parentNode.parentNode.children[3].value = '';
            e.target.parentNode.style.display = 'none';
            this.deletePostImage = true;
        },
        deleteImagePosted(e) {
            this.imagePosted = '';
            e.target.parentNode.style.display = 'none';
            e.target.parentNode.nextSibling.nextSibling.value = '';
        },
        focusInput(e) {
            e.target.nextSibling.click();
        },
        showEditedImage(e) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result
                e.target.parentNode.children[1].children[1].setAttribute('src', img.src);
                e.target.parentNode.children[1].classList.remove('hidden');
            }
            reader.readAsDataURL(e.target.files[0]);
            e.target.parentNode.children[1].style.display = 'block';
        },
        editPost(e) {
            const token = localStorage.getItem('token');
            const postId = e.target.closest('div.post').getAttribute('data-id');
            const editForm = e.target;
            let data = new FormData(editForm);
            if (this.deletePostImage) {
                data.append('deleteImage', true);
            }

            Axios.put(urlApi + `/posts/${postId}`, data, {
                headers: {
                    "authorization": 'Bearer ' + JSON.parse(token),
                }
            })
            .then((res) => {
                if (res) {
                    this.getAllPosts(token);
                }
            })
            .catch((err) => {
                console.log(err);
                if (err.response) {
                    this.error = err.response.data.error;
                } else {
                    this.error = "ERREUR SERVEUR ! Veuillez réessayer ultérieument !"
                }
            });

            this.deletePostImage = false;
        },
        toggleCommentSection(e) {
            e.target.closest('div').nextSibling.classList.toggle('hidden');
        },
        createComment(e) {
            const comment = e.target.children[1].value;
            const postId = e.target.closest('div.post').getAttribute('data-id');
            const token = localStorage.getItem('token');

            Axios.post(urlApi + `/posts/${postId}/comments`, {comment: comment, postId: postId}, {
                headers: {
                    "authorization": 'Bearer ' + JSON.parse(token),
                }
            })
            .then((res) => {
                if (res) {
                    this.getAllComments(token);
                    e.target.children[1].value = '';
                    this.commentError = '';
                }
            })
            .catch((err) => {
                console.log(err);
                if (err.response) {
                    this.error = err.response.data.error;
                } else {
                    this.error = "ERREUR SERVEUR ! Veuillez réessayer ultérieument !"
                }
            })
        },
        deleteComment(e) {
            const commentId = e.target.closest('div.one-comment').getAttribute('data-id');
            const token = localStorage.getItem('token');

            Axios.delete(urlApi + `/posts/comments/${commentId}`, {
                headers: {
                    "authorization": 'Bearer ' + JSON.parse(token),
                }
            })
            .then((res) => {
                if(res) {
                    this.getAllComments(token)
                }
            })
            .catch((err) => {
                console.log(err);
                if (err.response) {
                    this.error = err.response.data.error;
                } else {
                    this.error = "ERREUR SERVEUR ! Veuillez réessayer ultérieument !"
                }
            })
        },
        showEditCommentForm(e) {
            e.target.parentNode.parentNode.nextSibling.nextSibling.classList.toggle('hidden');
            setTimeout(() => {
                e.target.parentNode.parentNode.nextSibling.nextSibling.children[0].focus();
            }, 5);
        },
        editComment(e) {
            const commentId = e.target.closest('div.one-comment').getAttribute('data-id');
            const editedComment = e.target.children[0].value;
            const token = localStorage.getItem('token');

            Axios.put(urlApi + `/posts/comments/${commentId}`, {editedComment: editedComment}, {
                headers: {
                    "authorization": 'Bearer ' + JSON.parse(token)
                }
            })
            .then((res) => {
                if (res) {
                    this.getAllComments(token);
                }
            })
            .catch((err) => {
                console.log(err);
                if (err.response) {
                    this.error = err.response.data.error;
                } else {
                    this.error = "ERREUR SERVEUR ! Veuillez réessayer ultérieument !"
                }
            })
        },
        handleLike(e) {
            const postId = e.target.closest('div.post').getAttribute('data-id');
            const token = localStorage.getItem('token');

            Axios.post(urlApi + `/posts/${postId}/likes`, {like: 1}, {
                headers: {
                    "authorization": 'Bearer ' + JSON.parse(token),
                }
            })
            .then((res) => {
                if(res) {
                    this.getAllPosts(token);
                }
            })
            .catch((err) => {
                console.log(err);
                if (err.response) {
                    this.error = err.response.data.error;
                } else {
                    this.error = "ERREUR SERVEUR ! Veuillez réessayer ultérieument !"
                }
            })
        },
        getAllPosts(token) {
            Axios.get(urlApi + '/posts', {
                headers: {
                    "authorization": 'Bearer ' + JSON.parse(token),
                }
            })
            .then((res) => {
                res.data.forEach(post => {
                    post.postDate = moment(post.postDate).format('LLL');
                    return post
                });
                this.posts = res.data
            })
            .catch((err) => {
                console.log(err);
                if (err.response) {
                    this.error = err.response.data.error;
                } else {
                    this.error = "ERREUR SERVEUR ! Veuillez réessayer ultérieument !"
                }
            });
        },
        getAllComments(token) {
            Axios.get(urlApi + '/posts/comments/all', {
                headers: {
                    "authorization": 'Bearer ' + JSON.parse(token),
                }
            })
            .then((res) => {
                res.data.forEach(comment => {
                    comment.commentDate = moment(comment.commentDate).format('LLL');
                    return comment
                });
                this.comments = res.data;
            })
            .catch((err) => {
                console.log(err);
                if (err.response) {
                    this.error = err.response.data.error;
                } else {
                    this.error = "ERREUR SERVEUR ! Veuillez réessayer ultérieument !"
                }
            })
        }
    }
};
</script>

<style scoped src="../../public/styles/salon.css"></style>