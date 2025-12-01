import Home from "./components/Home.js";
import Login from "./components/Login.js";
import UserRegister from "./components/UserRegister.js";
import ProRegister from "./components/ProRegister.js";
import AdminDashboard from "./components/AdminDashboard.js";
import AdminSearch from "./components/AdminSearch.js";
import AdminSummary from "./components/AdminSummary.js";
import UserDashboard from "./components/UserDashboard.js";
import UserSearch from "./components/UserSearch.js";
import UserSummary from "./components/UserSummary.js";
import ProDashboard from "./components/ProDashboard.js";
import ProSearch from "./components/ProSearch.js";
import ProSummary from "./components/ProSummary.js";

const routes = [
  // --- Guest Routes (Accessible only if NOT logged in) ---
  { path: "/", component: Home, meta: { requiresGuest: true } },
  { path: "/login", component: Login, meta: { requiresGuest: true } },
  { path: "/user_register", component: UserRegister, meta: { requiresGuest: true } },
  { path: "/pro_register", component: ProRegister, meta: { requiresGuest: true } },

  // --- Admin Routes (Requires Admin Role) ---
  { path: "/admin_dashboard", component: AdminDashboard, meta: { requiresAuth: true, role: 'admin' } },
  { path: "/admin_search", component: AdminSearch, meta: { requiresAuth: true, role: 'admin' } },
  { path: "/admin_summary", component: AdminSummary, meta: { requiresAuth: true, role: 'admin' } },

  // --- Customer Routes (Requires Client Role) ---
  { path: "/user_dashboard", component: UserDashboard, meta: { requiresAuth: true, role: 'client' } },
  { path: "/user_search", component: UserSearch, meta: { requiresAuth: true, role: 'client' } },
  { path: "/user_summary", component: UserSummary, meta: { requiresAuth: true, role: 'client' } },

  // --- Professional Routes (Requires Prof Role) ---
  { path: "/pro_dashboard", component: ProDashboard, meta: { requiresAuth: true, role: 'prof' } },
  { path: "/pro_search", component: ProSearch, meta: { requiresAuth: true, role: 'prof' } },
  { path: "/pro_summary", component: ProSummary, meta: { requiresAuth: true, role: 'prof' } },
];

const router = new VueRouter({
  routes,
});

// --- Global Navigation Guard ---
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token');
  const userRole = localStorage.getItem('user_role');

  // 1. Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      // Not logged in? Go to login
      next({ path: '/login' });
    } else {
      // Logged in? Check if role matches
      if (to.meta.role && to.meta.role !== userRole) {
        // Role mismatch? Redirect to correct dashboard
        if (userRole === 'admin') next({ path: '/admin_dashboard' });
        else if (userRole === 'prof') next({ path: '/pro_dashboard' });
        else if (userRole === 'client') next({ path: '/user_dashboard' });
        else next({ path: '/login' }); // Unknown role
      } else {
        next(); // Role matches, proceed
      }
    }
  } 
  // 2. Check if the route is for Guests only (Home, Login, Register)
  else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (token) {
      // Logged in users shouldn't see Home/Login pages -> Redirect to their dashboard
      if (userRole === 'admin') next({ path: '/admin_dashboard' });
      else if (userRole === 'prof') next({ path: '/pro_dashboard' });
      else if (userRole === 'client') next({ path: '/user_dashboard' });
      else next();
    } else {
      next(); // Not logged in, proceed to Home/Login
    }
  } 
  else {
    next();
  }
});

const app = new Vue({
  el: "#app",
  router,
  template: `
    <div class="container-fluid p-0 m-0">
      <router-view></router-view>
    </div>
  `,
  data: {
    loggedIn: false,
  },
  methods: {},
});