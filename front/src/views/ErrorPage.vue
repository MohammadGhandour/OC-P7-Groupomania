<template>
    <div class="container">
        <h1>La page que vous viendrez de visiter n'existe pas !</h1>
        <img src="https://freefrontend.com/assets/img/html-funny-404-pages/SVG-Animation-404-Page.gif" alt="error-image">
    </div>
</template>

<script>
export default {
    mounted() {
        const body = document.querySelector('body');
        body.style.background = '#ECECEC'
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
            .catch((err) => console.log(err));
            
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
}
</script>

<style scoped>
    h1 {
        color: #333;
    }
    img {
        width: 100%;
    }
</style>