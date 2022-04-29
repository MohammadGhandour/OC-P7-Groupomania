<template>
  <div class="container">
    <ImageLogo />
    <div class="content">
      <h1>Bienvenue chez Groupomania !</h1>
      <h2>
        <router-link to="/register" class="router-connection" title="S'inscrire"> Inscrivez</router-link> ou <router-link to="/login" class="router-connection" title="Se connecter">connectez</router-link> vous pour y accéder 😉
      </h2>
      <img src="../assets/together.svg" class="secondary-img" alt="">
    </div>
  </div>
</template>

<script>
import ImageLogo from '../components/ImageLogo.vue'

export default {
  components: {ImageLogo},
  mounted() {
    if (localStorage.getItem('token')) {
      this.$router.push('/salon');
    }
  }
}
</script>

<style scoped>
  h1 {
    font-size: 24px;
  }
  h2 {
    font-size: 18px;
    margin: 20px 0;
  }
  .secondary-img {
    width: 300px;
    margin: 20px 0 0 0;
  }

  @media screen and (max-width: 800px) {
  .secondary-img {
    width: 250px;
  }
}
</style>