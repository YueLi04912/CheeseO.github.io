import { createRouter, createWebHistory } from 'vue-router'

// User pages
import Home from '@/views/user/Home.vue'
import About from '@/views/user/About.vue'
import Edit from '@/views/user/Edit.vue'
import Post from '@/views/user/Post.vue'
import Projects from '@/views/user/Projects.vue'
import Video from '@/views/user/Video.vue'
import Withdraw from '@/views/user/Withdraw.vue'

// Login pages
import Login from '@/views/login/Login.vue'
import Register from '@/views/login/Register.vue'
import ForgetPassword from '@/views/login/Forget-Password.vue'
import ResetPassword from '@/views/login/Reset-Password.vue'
import BindPhone from '@/views/login/Bind-Phone.vue'

// Admin pages
import Dashboard from '@/views/admin/Dashboard.vue'
import Category from '@/views/admin/Category.vue'
import Content from '@/views/admin/Content.vue'
import CoursePost from '@/views/admin/CoursePost.vue'
import Detail from '@/views/admin/Detail.vue'
import Points from '@/views/admin/Points.vue'
import User from '@/views/admin/User.vue'

// Article detail page
import Article from '@/views/Article.vue'

const routes = [
  // Home
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  
  // Article detail - New
  {
    path: '/article/:id',
    name: 'Article',
    component: Article,
    props: true
  },
  
  // User related pages
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { requiresAuth: true }
  },
  {
    path: '/edit',
    name: 'Edit',
    component: Edit,
    meta: { requiresAuth: true }
  },
  {
    path: '/post',
    name: 'Post',
    component: Post,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
    meta: { requiresAuth: true }
  },
  {
    path: '/video/:id',
    name: 'Video',
    component: Video,
    props: true,
    meta: { requiresAuth: false } 
  },
  {
    path: '/withdraw',
    name: 'Withdraw',
    component: Withdraw,
    meta: { requiresAuth: true }
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
    path: '/login/Register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login/Forget-Password',
    name: 'ForgetPassword',
    component: ForgetPassword
  },
  {
    path: '/login/Reset-Password',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/login/Bind-Phone',
    name: 'BindPhone',
    component: BindPhone
  },
  
  // Admin pages
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: Dashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/category',
    name: 'AdminCategory',
    component: Category,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/content',
    name: 'AdminContent',
    component: Content,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/coursepost',
    name: 'AdminCoursePost',
    component: CoursePost,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/user-detail/:id',
    name: 'AdminUserDetail',
    component: Detail,
    props: true,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/points',
    name: 'AdminPoints',
    component: Points,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/user',
    name: 'AdminUser',
    component: User,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  
  // 404 Page
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    void to; void from;
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Route guards
router.beforeEach((to, from, next) => {
  void from;
  // Check if login is required
  if (to.meta.requiresAuth) {
    const currentUser = JSON.parse(localStorage.getItem('app_current_user') || 'null')
    if (!currentUser) {
      next('/Login')
      return
    }
    
    // Check if user is banned
    if (currentUser.status === 'banned') {
      // Clear user info
      localStorage.removeItem('app_current_user')
      // Optional: redirect to specific page or login page with error
      alert('Your account has been banned, please contact the administrator.')
      next('/Login')
      return
    }
    
    // Check if admin permission is required
    if (to.meta.requiresAdmin && currentUser.role !== 'admin') {
      next('/')
      return
    }
  }
  
  next()
})

export default router