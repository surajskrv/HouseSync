export default {
  template: `
    <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">HouseSync</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item" v-if="loggedIn">
              <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
            </li>
            <li class="nav-item" v-if="loggedIn">
              <router-link class="nav-link" to="/search">Search</router-link>
            </li>
            <li class="nav-item" v-if="loggedIn">
              <router-link class="nav-link" to="/summary">Summary</router-link>
            </li>
            <li class="nav-item" v-if="loggedIn">
              <button @click="logoutUser" class="btn">Logout</button>
            </li>
            <li class="nav-item" v-if="!loggedIn">
              <router-link class="nav-link" aria-current="page" to="/login">Login</router-link>
            </li>
        </ul>
      </div>
    </div>
  </nav>
    `,
    data: function(){
      return {
          loggedIn: localStorage.getItem('auth_token')
      }
  },
  methods:{
      logoutUser(){
          localStorage.clear()
          this.$router.go('/')
          this.$emit('logout')
      }
  },
};
