export default {
  template: `
  <div class="user-summary container-fluid min-vh-100 d-flex flex-column bg-light font-sans">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-info fixed-top shadow-sm border-bottom border-info-subtle">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center gap-2" to="/user_dashboard">
          <i class="bi bi-house-heart-fill fs-4 text-white"></i>
          <span class="fw-bold fs-4 tracking-tight">User Portal</span>
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#userNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="userNav">
          <ul class="navbar-nav ms-auto align-items-center gap-3">
            <li class="nav-item">
              <router-link to="/user_dashboard" class="nav-link text-white" active-class="active fw-bold">
                <i class="bi bi-speedometer2 me-1"></i> Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/user_search" class="nav-link text-white" active-class="active fw-bold">
                <i class="bi bi-search me-1"></i> Search
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/user_summary" class="nav-link text-white" active-class="active fw-bold">
                <i class="bi bi-person-circle me-1"></i> Profile
              </router-link>
            </li>
            <li class="nav-item ms-lg-2">
              <button class="btn btn-outline-light btn-sm rounded-pill px-4 fw-semibold" @click="logout">
                <i class="bi bi-box-arrow-right me-1"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container py-5 mt-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          
          <div class="card border-0 shadow mb-4">
            <div class="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
              <h4 class="fw-bold mb-0">Customer Profile</h4>
              <span class="badge bg-info bg-opacity-10 text-info rounded-pill px-3"><i class="bi bi-person-check-fill me-1"></i> Verified User</span>
            </div>
            <div class="card-body p-4 pt-0">
              <form @submit.prevent="updateProfile">
                <div class="mb-3">
                  <label class="form-label text-muted small fw-bold">FULL NAME</label>
                  <input type="text" class="form-control" v-model="profile.name" required>
                </div>
                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label class="form-label text-muted small fw-bold">EMAIL</label>
                    <input type="email" class="form-control bg-light" v-model="profile.email" disabled readonly>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label text-muted small fw-bold">PHONE</label>
                    <input type="tel" class="form-control" v-model="profile.phone" required>
                  </div>
                </div>
                <div class="row g-3 mb-4">
                  <div class="col-md-8">
                    <label class="form-label text-muted small fw-bold">ADDRESS</label>
                    <input type="text" class="form-control" v-model="profile.address" required>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label text-muted small fw-bold">PINCODE</label>
                    <input type="text" class="form-control" v-model="profile.pincode" required>
                  </div>
                </div>
                <div class="d-flex justify-content-end">
                  <button type="submit" class="btn btn-info text-white px-4 rounded-pill fw-semibold">Save Changes</button>
                </div>
              </form>
            </div>
          </div>

          <div class="card border-0 shadow">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-3">Usage Statistics</h5>
              <div class="row text-center g-3">
                <div class="col-6">
                  <div class="p-3 bg-light rounded h-100">
                    <h2 class="fw-bold text-info mb-0">{{ myRequests.length }}</h2>
                    <small class="text-muted">Total Requests</small>
                  </div>
                </div>
                <div class="col-6">
                  <div class="p-3 bg-light rounded h-100">
                    <h2 class="fw-bold text-success mb-0">{{ myRequests.filter(j => j.status === 'completed').length }}</h2>
                    <small class="text-muted">Completed Services</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      profile: {},
      myRequests: []
    };
  },
  mounted() {
    this.fetchProfile();
    this.fetchStats();
  },
  methods: {
    async fetchWithAuth(url, options = {}) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token"),
            ...options.headers
          },
        });
        if (response.status === 401 || response.status === 403) {
          this.logout();
          return null;
        }
        return response;
      } catch (err) {
        console.error("Fetch error:", err);
        return null;
      }
    },

    async fetchProfile() {
      const res = await this.fetchWithAuth('/api/user/profile');
      if (res && res.ok) this.profile = await res.json();
    },

    async updateProfile() {
      const res = await this.fetchWithAuth('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify(this.profile)
      });
      if (res && res.ok) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile.');
      }
    },

    async fetchStats() {
      const res = await this.fetchWithAuth('/api/user/requests');
      if (res && res.ok) this.myRequests = await res.json();
    },

    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
};