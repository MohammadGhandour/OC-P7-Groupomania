<template>
    <Navbar :username="user.username" :profileImage="user.profileImage"/>
    <div class="container">
        <div class="profile-infos">
            <h2>Modifier mon profile</h2>
            <form class="profile-infos-content" enctype="multipart/form-data" id="editForm" @submit.prevent="updateUser" ref="form">
                <div class="form-row">
                    <img :src="user.profileImage" alt="user-img" class="user-image" v-if="!imageUpdated" title="Photo de profile">
                    <img :src="imageUpdated" alt="preview image to upload" class="user-image" v-if="imageUpdated">
                    <label for="profileInput"><i class="fa-solid fa-upload"></i> Changer votre photo</label>
                    <input type="file" name="image" id="profileInput" @change="showImageUpdated">
                </div>
                <div class="form-row">
                    <label for="username" class="info-type">Pseudonyme:</label>
                    <input type="text" name="username" id="username" :placeholder="user.username" autocomplete="off">
                </div>
                <div class="form-row">
                    <label for="email" class="info-type">Email:</label>
                    <input type="email" name="email" id="email" :placeholder="user.email" autocomplete="off">
                </div>
                <button class="edit-btn btn">Sauvegarder</button>
            </form>
            <router-link to="/delete-profile" class="delete-btn btn">Supprimer mon profile</router-link>
            <div class="message error" v-if="error">{{ error }}</div>
        </div>
    </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import Axios from 'axios'
const urlApi = 'http://localhost:3333'

export default {
    name: 'EditProfile',
    components: {Navbar},
    data(){
        return {
            user: {},
            imageUpdated: '',
            error: ''
        }
    },
    mounted() {
        const body = document.querySelector('body');
        body.style.background = '#F0F2F5'
        body.style.setProperty('--onAnotherPages', 'relative');
        const token = localStorage.getItem('token');
        const userId = JSON.parse(localStorage.getItem('userId'));

        Axios.get(urlApi + `/user/${userId}`, {
            headers: {
                "authorization": 'Bearer ' + JSON.parse(token),
            }
        })
        .then((res) => {
            this.user = res.data
        })
    },
    unmounted() {
        const body = document.querySelector('body');
        body.style.background = ""
        body.style.setProperty('--onAnotherPages', 'absolute')
    },
    methods: {
        showImageUpdated(e) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result
                this.imageUpdated = img.src
            }
            reader.readAsDataURL(e.target.files[0]);
        },
        updateUser() {
            const editForm = document.getElementById('editForm');
            const data = new FormData(editForm);
            const token = JSON.parse(localStorage.getItem('token'));
            const userId = JSON.parse(localStorage.getItem('userId'));

            Axios.put(urlApi + `/user`, data, {
                headers: {
                    "authorization": 'Bearer ' + token,
                }
            })
            .then((res) => {
                if (res) {
                    this.getUserInfo(userId, token);
                    this.error = '';
                }
            })
            .catch((err) => {
                console.log(err);
                this.error = err.response.data.error;
            })
        },
        getUserInfo(userId, token) {
            Axios.get(urlApi + `/user/${userId}`, {
                headers: {
                    "authorization": 'Bearer ' + token,
                }
            })
            .then((res) => {
                this.user = res.data
                this.$refs.form.reset();
            })
            .catch((err) => {
                console.log(err);
            })
        },
    }
}
</script>

<style scoped src="../../public/styles/edit.css">

</style>