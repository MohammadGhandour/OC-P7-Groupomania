<template>
    <div class="container">
        <ImageLogo />
        <div class="router-links">
            <router-link to="/register" class="router-connection active" title="S'inscrire">S'inscrire</router-link>
            <router-link to="/login" class="router-connection inactive" title="Se connecter">Se connecter</router-link>
        </div>
        <div class="content">
            <div class="message error">{{ error }}</div>
            <form enctype="multipart/form-data" id="myForm" @submit.prevent="register">
                <div class="form-row">
                    <label for="username">Pseudonyme: <span>(obligatoire)</span></label>
                    <input type="text" name="username" id="username">
                </div>
                <div class="form-row">
                    <label for="email">Email: <span>(obligatoire)</span></label>
                    <input type="text" name="email" id="email" placeholder="jhon-snow@gmail.com" required>
                </div>
                <div class="form-row">
                    <label for="password">Mot de passe: <span>(obligatoire)</span></label>
                    <input type="password" name="password" id="password" required>
                </div>
                <div class="form-row">
                    <div v-if="imagePosted" class="image-wrapper">
                        <img :src="imagePosted" alt="preview image to upload" title="Photo de profile">
                        <div class="delete-added-pic" @click="deleteAddedImage">Supprimer</div>
                    </div>
                    <label for="image" id="imageLabel"><i class="fa-solid fa-image"></i> Ajouter une photo de profile !</label>
                    <input type="file" name="image" id="image" @change="showAddedImage">
                </div>
                <button>S'inscrire</button>
            </form>
        </div>
    </div>
</template>

<script>
import ImageLogo from '../components/ImageLogo.vue';
import Axios from 'axios';
const urlApi = "http://localhost:3333/user";

export default {
    name: 'Register',
    components: {ImageLogo},
    data() {
        return {
            error: '',
            imagePosted: ''
        }
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
        deleteAddedImage() {
            this.imagePosted = '';
            document.getElementById('image').value = null;
        },
        register() {
            const myForm = document.getElementById('myForm');
            let data = new FormData(myForm);
            
            Axios.post(urlApi + '/signup', data)
            .then((res) => {
                this.error = '';
                this.$router.push("/login");
            })
            .catch((err) => {
                this.error = err.response.data.error;
                console.log(err);
            })
        }
    }
}
</script>

<style scoped src="../../public/styles/register.css"></style>