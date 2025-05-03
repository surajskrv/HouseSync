export default {
  template: `
  <div class="container-fluid min-vh-100 bg-light d-flex flex-column">
    <link rel="stylesheet" href="../static/css/nav.css">
    <link rel="stylesheet" href="../static/css/password.css">
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top shadow-sm py-2 nav-color">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <i class="bi bi-house-heart-fill me-2 fs-4"></i>
          <span class="fw-bold fs-4" style="letter-spacing: 0.5px;">HouseSync</span>
        </router-link>
        <div class="ms-auto">
          <router-link to="/login" class="btn btn-outline-light px-3 px-sm-4 rounded-pill">
            <i class="bi bi-box-arrow-in-right me-1 me-sm-2"></i>
            <span class="d-none d-sm-inline">Login</span>
          </router-link>
        </div>
      </div>
    </nav>
    <main class="flex-grow-1 d-flex align-items-center py-5 mt-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div class="card border-primary shadow-lg p-3 p-md-4 bg-white rounded">
              <form @submit.prevent="loginUser">
                <h3 class="text-center mb-4">Login</h3>
                <div class="mb-3">
                  <label for="email" class="form-label">Email (Username)</label>
                  <input
                    id="email"
                    name="email"
                    class="form-control"
                    placeholder="example@gmail.com"
                    type="email"
                    required
                    autofocus
                    v-model="formData.email"
                  >
                </div>
                <div class="mb-3 position-relative">
                  <label for="password" class="form-label">Password</label>
                  <input
                    id="password"
                    name="password"
                    class="form-control pe-5"
                    placeholder="password"
                    type="password"
                    required
                    v-model="formData.password"
                  >
                  <button type="button" class="btn btn-link position-absolute end-0 top-50 btn-position translate-middle-y"@click="togglePass">
                    <img :src="showPassword ? eyeOpen : eyeClose" class="toggle-img" alt="Toggle password">
                  </button>
                </div>
                <div class="d-grid mb-3">
                  <button type="submit" class="btn btn-primary">Login</button>
                </div>
                <div class="d-flex flex-column flex-sm-row justify-content-between gap-2">
                  <router-link to="./user_register" class="btn btn-outline-success flex-grow-1">
                    Create Account
                  </router-link>
                  <router-link to="./pro_register" class="btn btn-outline-primary flex-grow-1">
                    Professional Register
                  </router-link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  `,
  data() {
    return {
      formData: {
        email: "",
        password: "",
      },
      eyeClose: "./static/img/eye-close.png",
      eyeOpen: "./static/img/eye-open.png",
      showPassword: false
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.formData),
        });
    
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
    
        localStorage.setItem("auth_token", data.auth_token);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("user_role", data.user_role);

        switch(data.user_role) {
          case 'admin':
            this.$router.push('/admin_dashboard');
            break;
          case 'pro':
            this.$router.push('/pro_dashboard');
            break;
          case 'user':
            this.$router.push('/user_dashboard');
            break;
          default:
            this.$router.push('/');
        }
      } catch (error) { 
        console.error("Login error:", error);
        this.errorMessage = error.message || "Login failed. Please try again.";
      }
    },
    togglePass() {
      this.showPassword = !this.showPassword;
      const passwordInput = document.getElementById("password");
      passwordInput.type = this.showPassword ? "text" : "password";
    },
  },
};