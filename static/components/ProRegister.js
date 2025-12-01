export default {
  template: `
  <div class="container-fluid min-vh-100 bg-light d-flex flex-column">
    <link rel="stylesheet" href="../static/css/nav.css">
    <nav class="navbar navbar-expand-lg navbar-dark nav-color fixed-top">
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
          <div class="col-12 col-md-10 col-lg-8 col-xl-6">
            <div class="card border-primary shadow-lg p-3 p-md-4 bg-white rounded">
              <form @submit.prevent="addPro">
                <h3 class="text-center mb-4">Service Professional Signup</h3>
                
                <!-- Error Alert -->
                <div v-if="errorMessage" class="alert alert-danger fade show" role="alert">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i> {{ errorMessage }}
                </div>

                <!-- Success Flash Message -->
                <div v-if="successMessage" class="alert alert-success fade show text-center" role="alert">
                  <i class="bi bi-check-circle-fill me-2"></i> {{ successMessage }}
                </div>

                <div class="row g-3">
                  <div class="col-12">
                    <label for="email" class="form-label">Email (username)</label>
                    <input 
                      id="email" 
                      class="form-control" 
                      placeholder="example@gmail.com" 
                      type="email" 
                      required
                      v-model="formData.email"
                    >
                  </div>
                  <div class="col-12 col-md-6">
                    <label for="password" class="form-label">Password</label>
                    <input
                      id="password"
                      class="form-control"
                      placeholder="password"
                      type="password"
                      required
                      v-model="formData.password"
                      minlength="5"
                    >
                  </div>
                  <div class="col-12 col-md-6">
                    <label for="password2" class="form-label">Password (Confirm)</label>
                    <input
                      id="password2"
                      class="form-control"
                      placeholder="password"
                      type="password"
                      required
                      v-model="formData.password2"
                      minlength="5"
                    >
                  </div>
                  <div class="col-12">
                    <label for="name" class="form-label">Full name</label>
                    <input 
                      id="name" 
                      class="form-control" 
                      placeholder="Name" 
                      type="text" 
                      required
                      v-model="formData.name"
                    >
                  </div>
                  <div class="col-12 col-md-6">
                    <label for="service_type" class="form-label">Service Type</label>
                    <select 
                      class="form-select" 
                      id="service_type" 
                      required
                      v-model="formData.service_type"
                    >
                      <option disabled value="">Choose any</option>
                      <option v-for="service in services" :key="service.id" :value="service.name">
                        {{ service.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-12 col-md-6">
                    <label for="experience" class="form-label">Experience (in yrs)</label>
                    <input 
                      id="experience" 
                      class="form-control" 
                      placeholder="0" 
                      type="number" 
                      min="0" 
                      required
                      v-model.number="formData.experience"
                    >
                  </div>
                  <div class="col-12">
                    <label for="phone" class="form-label">Phone Number</label>
                    <input 
                      id="phone" 
                      class="form-control" 
                      placeholder="9876543210" 
                      type="tel" 
                      pattern="[0-9]{10}"
                      title="Please enter a 10-digit phone number"
                      required
                      v-model="formData.phone"
                    >
                  </div>
                  <div class="col-12 mt-4 d-flex flex-column flex-sm-row justify-content-between gap-3">
                    <button 
                      type="submit" 
                      class="btn btn-outline-success flex-grow-1"
                      :disabled="isLoading"
                    >
                      <span v-if="!isLoading">Submit</span>
                      <span v-else>
                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Processing...
                      </span>
                    </button>
                    </div>
                    <div class="col-12 mt-2 text-center">
                      <router-link to="/login" class="flex-grow-1 text-center">Existing Professional?</router-link>
                    </div>
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
        password2: "",
        name: "",
        experience: 0,
        phone: "",
        service_type: "",
      },
      services: [],
      isLoading: false,
      errorMessage: "",
      successMessage: "" 
    };
  },
  mounted() {
    this.fetchServiceTypes();
  },
  methods: {
    async fetchServiceTypes() {
      try {
        const response = await fetch('/api/public/services');
        if (response.ok) {
          this.services = await response.json();
        } else {
          console.error("Failed to fetch services");
        }
      } catch (err) {
        console.error("Error fetching services", err);
      }
    },
    async addPro() {
      // Prevent double submission if already loading
      if (this.isLoading) return;

      try {
        this.errorMessage = "";
        this.successMessage = "";

        // Client-side Validation
        if (this.formData.password !== this.formData.password2) {
          this.errorMessage = "Passwords do not match";
          return;
        }

        if (this.formData.password.length < 5) {
          this.errorMessage = "Password must be at least 5 characters";
          return;
        }

        if (!/^[0-9]{10}$/.test(this.formData.phone)) {
          this.errorMessage = "Please enter a valid 10-digit phone number";
          return;
        }

        if (this.formData.service_type === "") {
          this.errorMessage = "Please select a service type";
          return;
        }

        this.isLoading = true;

        const response = await fetch("/api/register/prof", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.formData.email.trim(),
            password: this.formData.password,
            password2: this.formData.password2,
            name: this.formData.name.trim(),
            phone: this.formData.phone,
            experience: Number(this.formData.experience),
            service_type: this.formData.service_type,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        // Show success flash message
        this.successMessage = "Registration successful! You will soon get a call for verification. Once verified, you will be able to login.";
        
        // Clear form
        this.formData = {
          email: "", password: "", password2: "", name: "", experience: 0, phone: "", service_type: ""
        };

        // Redirect to Home after 3 seconds
        setTimeout(() => {
          this.$router.push("/");
        }, 8000);
        
      } catch (error) {
        console.error("Registration error:", error);
        this.errorMessage = error.message || "Registration failed. Please try again.";
        // Reset loading state on error so user can try again
        this.isLoading = false;
      }
      // Note: We don't set isLoading = false in 'finally' if successful, 
      // to prevent user clicking while redirect is pending.
    }
  }
};