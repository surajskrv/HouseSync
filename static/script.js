import Home from "./components/Home.js";
import Login from "./components/Login.js";
import UserRegister from "./components/UserRegister.js";
import ProRegister from "./components/ProRegister.js";
import Navbar from "./components/Navbar.js";
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
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/user_register", component: UserRegister },
  { path: "/pro_register", component: ProRegister },
  { path: "/admin_dashboard", component: AdminDashboard },
  { path: "/admin_search", component: AdminSearch },
  { path: "/admin_summary", component: AdminSummary },
  { path: "/user_dashboard", component: UserDashboard },
  { path: "/user_search", component: UserSearch },
  { path: "/user_summary", component: UserSummary },
  { path: "/pro_dashboard", component: ProDashboard },
  { path: "/pro_search", component: ProSearch },
  { path: "/pro_summary", component: ProSummary },
];

const router = new VueRouter({
  routes,
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
  components: {
    navbar: Navbar,
  },
  methods: {},
});
