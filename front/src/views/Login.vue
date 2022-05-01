<template>
    <div class="container">
        <ImageLogo />
        <div class="router-links">
            <router-link to="/register" class="router-connection inactive" title="S'inscrire">S'inscrire</router-link>
            <router-link to="/login" class="router-connection active" title="Se connecter">Se connecter</router-link>
        </div>
        <div class="content">
            <div class="message error" v-if="error">{{ error }}</div>
            <form enctype="multipart/form-data" id="myForm" @submit.prevent="login">
                <div class="form-row">
                    <label for="email">Email:</label>
                    <input type="email" name="email" id="email" placeholder="jhon-snow@gmail.com" v-model="email" required>
                </div>
                <div class="form-row">
                    <label for="password">Mot de passe:</label>
                    <input type="password" name="password" id="password" v-model="password" required>
                </div>
                <button>Se connecter</button>
            </form>
        </div>
    </div>
</template>

<script>
import ImageLogo from "../components/ImageLogo.vue"
import Axios from "axios"
const urlApi = "http://localhost:3333/user";

export default {
    name: 'Login',
    components: {ImageLogo},
    data() {
        return {
            email: '',
            password: '',
            error: ''
        }
    },
    mounted() {
        if (localStorage.getItem('token')) {
            this.$router.push('/salon');
        }
    },
    methods: {
        login() {
            const user = {
                email: this.email,
                password: this.password,
            }
            Axios.post(urlApi + '/login', user)
            .then((res) => {
                if (res) {
                    this.error = '';
                    const token = res.data.token
                    localStorage.setItem('token', JSON.stringify(token));
                    localStorage.setItem('userId', res.data.userId);
                    localStorage.setItem('admin', res.data.admin);
                    this.$router.push("/salon");
                }
            })
            .catch((err) => {
                console.log(err);
                this.error = err.response.data.error;
            })
        }
    }
}
</script>

<style scoped src="../../public/styles/register.css"></style>