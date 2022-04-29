<template>
    <Navbar :username="user.username" :profileImage="user.profileImage"/>
    <div class="container">
        <div class="delete-content">
            <div class="warning"><i class="fa-solid fa-circle-exclamation"></i> Cette action est irréversible ! Toutes vos données seront supprimées !</div>
            <form @submit.prevent="deleteProfile" class="form-row">
                <label for="password">Confirmer votre mot de passe: </label>
                <input type="password" v-model="password" id="password">
                <button id="btnnn">Supprimer mon profile</button>
            </form>
        </div>
    </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import Axios from 'axios'
const urlApi = 'http://localhost:3333'

export default {
    name: 'delete-profile',
    components: {Navbar},
    data() {
        return {
            user: {},
            password: ''
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
        deleteProfile() {
            const userId = JSON.parse(localStorage.getItem('userId'));
            const token = JSON.parse(localStorage.getItem('token'));
            const password = this.password;

            Axios.delete(urlApi + `/user/${userId}`, {
                headers: {
                    "authorization": 'Bearer ' + token,
                },
                data: {password: password}
            })
            .then((res) => {
                console.log(res);
                localStorage.clear();
                this.$router.push("/");
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }
}
</script>

<style scoped src="../../public/styles/delete.css"></style>