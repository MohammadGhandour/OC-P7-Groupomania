<template>
    <header>
        <nav>
            <router-link to="/salon" title="Page d'acceuil">
                <img src="../assets/icon.png" alt="logo-groupomania" class="logo">
            </router-link>
            <div class="links">
                <router-link class="router-link user" to="/personal-profile" title="Mon profile">
                    <img :src="profileImage" alt="user-img" class="user-img">
                    <span>{{ username }}</span>
                </router-link>
                <router-link to="/" class="router-link" @click="logout" title="Se deconnecter">
                    <i class="fa-solid fa-right-from-bracket"></i>
                </router-link>
            </div>
        </nav>
    </header>
</template>

<script>

export default {
    name: 'Navbar',
    props: ['username', 'profileImage'],
    created() {
        window.addEventListener("scroll", this.handleScroll);
    },
    methods: {
        logout() {
            localStorage.clear();
        },
        handleScroll(e) {
            const header = document.querySelector('header');
            const userImage = document.querySelector('.user-img');
            const logo = document.querySelector('.logo');
            header.addEventListener('mouseover', () => {
                header.style.opacity = '1';
            })

            window.addEventListener('scroll', function() {
                const scroll = this.document.documentElement.scrollTop;
                if (scroll > 175) {
                    header.style.opacity = '0.7';
                } else {
                    header.style.opacity = '1';
                }
            })
        }
    }
};
</script>

<style>
    header {
        background: #0072ca;
        box-shadow: 0px 5px 5px rgba(51, 51, 51, 0.1);
        height: 65px;
        width: 100%;
        display: flex;
        align-items: center;
        position: fixed;
        z-index: 100000;
        transition: all 0.2s;
    }
    header:hover {
        opacity: 1;
    }
    header .logo {
        width: 50px;
        object-fit: cover;
        filter: brightness(100);
    }
    nav {
        width: 50%;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .links {
        display: flex;
        align-items: center;
    }
    .router-link {
        color: #fff;
        font-weight: bold;
        font-size: 18px;
        text-decoration: none;
    }
    .router-link i {
        font-size: 22px;
    }
    .router-link:hover {
        text-decoration: underline;
    }
    .user {
        display: flex;
        align-items: center;
        margin-right: 25px;
    }
    .user-img {
        width: 50px;
        object-fit: cover;
        margin-right: 5px;
        border-radius: 50%;
        aspect-ratio: 1;
    }
    @media screen and (max-width: 800px) {
        nav {
            width: 90%;
        }
        .router-link {
            width: min-content;
        }
    }
    @media screen and (min-width: 800px) {
        nav {
            min-width: 720px;
        }
    }
</style>