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