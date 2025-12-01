export default {
  template: `
  <div class="pro-summary container-fluid min-vh-100 d-flex flex-column bg-light font-sans">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-success fixed-top shadow-sm border-bottom border-success-subtle">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center gap-2" to="/pro_dashboard">
          <i class="bi bi-tools fs-4 text-white"></i>
          <span class="fw-bold fs-4 tracking-tight">Pro Portal</span>
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#proNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="proNav">
          <ul class="navbar-nav ms-auto align-items-center gap-3">
            <li class="nav-item">
              <router-link to="/pro_dashboard" class="nav-link text-white" active-class="active fw-bold">
                <i class="bi bi-speedometer2 me-1"></i> Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/pro_search" class="nav-link text-white" active-class="active fw-bold">
                <i class="bi bi-search me-1"></i> Search Jobs
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/pro_summary" class="nav-link text-white" active-class="active fw-bold">
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
              <h4 class="fw-bold mb-0">Professional Profile</h4>
              <span v-if="profile.is_verified" class="badge bg-success bg-opacity-10 text-success rounded-pill px-3"><i class="bi bi-check-circle-fill me-1"></i> Verified</span>
              <span v-else class="badge bg-warning text-dark rounded-pill px-3"><i class="bi bi-clock-fill me-1"></i> Pending Verification</span>
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
                  <div class="col-md-6">
                    <label class="form-label text-muted small fw-bold">SERVICE TYPE</label>
                    <input type="text" class="form-control bg-light" v-model="profile.service_type" disabled readonly>
                    <div class="form-text">Contact admin to change service specialization.</div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label text-muted small fw-bold">EXPERIENCE (YEARS)</label>
                    <input type="number" class="form-control" v-model="profile.experience" required>
                  </div>
                </div>
                <div class="d-flex justify-content-end">
                  <button type="submit" class="btn btn-success px-4 rounded-pill fw-semibold">Save Changes</button>
                </div>
              </form>
            </div>
          </div>

          <div class="card border-0 shadow">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-3">Account Statistics</h5>
              <div class="row text-center g-3">
                <div class="col-4">
                  <div class="p-3 bg-light rounded h-100">
                    <h2 class="fw-bold text-success mb-0">{{ myJobs.length }}</h2>
                    <small class="text-muted">Total Jobs</small>
                  </div>
                </div>
                <div class="col-4">
                  <div class="p-3 bg-light rounded h-100">
                    <h2 class="fw-bold text-primary mb-0">{{ myJobs.filter(j => j.status === 'closed').length }}</h2>
                    <small class="text-muted">Completed</small>
                  </div>
                </div>
                <div class="col-4">
                  <div class="p-3 bg-light rounded h-100">
                    <h2 class="fw-bold text-warning mb-0">{{ calculateAvgRating() }}</h2>
                    <small class="text-muted">Avg Rating</small>
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
      myJobs: []
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
      const res = await this.fetchWithAuth('/api/prof/profile');
      if (res && res.ok) this.profile = await res.json();
    },

    async updateProfile() {
      const res = await this.fetchWithAuth('/api/prof/profile', {
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
      // Reusing my_jobs API to calculate stats on client side
      const res = await this.fetchWithAuth('/api/prof/my_jobs');
      if (res && res.ok) this.myJobs = await res.json();
    },

    calculateAvgRating() {
      const ratedJobs = this.myJobs.filter(j => j.rating);
      if (ratedJobs.length === 0) return 'N/A';
      const total = ratedJobs.reduce((acc, curr) => acc + curr.rating, 0);
      return (total / ratedJobs.length).toFixed(1);
    },

    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
};