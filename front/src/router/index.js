import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Salon from '../views/Salon.vue'
import PersonalProfile from '../views/PersonalProfile.vue'
import EditProfile from '../views/EditProfile.vue'
import DeleteProfile from '../views/DeleteProfile.vue'
import UserProfile from '../views/UserProfile.vue'
import ErrorPage from '../views/ErrorPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/salon',
    name: 'Salon',
    component: Salon
  },
  {
    path: '/personal-profile',
    name: 'personal-profile',
    component: PersonalProfile
  },
  {
    path: '/profile/:id',
    name: 'profile',
    component: UserProfile
  },
  {
    path: '/edit',
    name: 'edit',
    component: EditProfile
  },
  {
    path: '/delete-profile',
    name: 'delete-profile',
    component: DeleteProfile
  },
  {
    path: '/:catchAll(.*)',
    name: 'ErrorPage',
    component: ErrorPage,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
