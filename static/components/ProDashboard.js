export default {
  template: `
  <div class="pro-dashboard container-fluid min-vh-100 d-flex flex-column bg-light font-sans">
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
      
      <!-- Welcome Section -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card border-0 shadow-sm bg-white">
            <div class="card-body p-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <h4 class="fw-bold text-dark mb-1">Welcome back, {{ profile.name || 'Professional' }}!</h4>
                <p class="text-muted mb-0">
                  <span class="badge bg-success bg-opacity-10 text-success me-2">{{ profile.service_type }} Expert</span>
                  <span v-if="profile.is_verified" class="badge bg-primary bg-opacity-10 text-primary"><i class="bi bi-patch-check-fill me-1"></i>Verified</span>
                  <span v-else class="badge bg-warning text-dark"><i class="bi bi-hourglass-split me-1"></i>Pending Verification</span>
                </p>
              </div>
              <div class="d-flex gap-3 text-center">
                <div class="px-3 border-end">
                  <h3 class="fw-bold text-success mb-0">{{ myJobs.filter(j => j.status === 'assigned').length }}</h3>
                  <small class="text-muted text-uppercase fw-bold" style="font-size: 0.7rem;">Active</small>
                </div>
                <div class="px-3">
                  <h3 class="fw-bold text-dark mb-0">{{ myJobs.filter(j => j.status === 'closed').length }}</h3>
                  <small class="text-muted text-uppercase fw-bold" style="font-size: 0.7rem;">Completed</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        
        <!-- Available Jobs Column -->
        <div class="col-lg-6">
          <div class="card border-0 shadow h-100">
            <div class="card-header bg-white border-0 p-4 sticky-top z-1">
              <div class="d-flex align-items-center gap-3 mb-2">
                <div class="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                  <i class="bi bi-briefcase-fill"></i>
                </div>
                <div>
                  <h5 class="fw-bold mb-0">New Opportunities</h5>
                  <small class="text-muted">Jobs matching your skills</small>
                </div>
              </div>
            </div>
            <div class="card-body p-0 overflow-auto custom-scrollbar" style="max-height: 600px;">
              
              <div v-if="!profile.is_verified" class="p-5 text-center">
                <i class="bi bi-shield-lock fs-1 text-muted d-block mb-3"></i>
                <h6 class="text-muted">Account Under Review</h6>
                <p class="small text-muted">You can accept jobs once an admin verifies your profile.</p>
              </div>

              <div v-else-if="availableRequests.length === 0" class="p-5 text-center">
                <i class="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
                <h6 class="text-muted">No New Jobs</h6>
                <p class="small text-muted">Check back later for new requests in your area.</p>
              </div>

              <div v-else class="list-group list-group-flush">
                <div v-for="req in availableRequests" :key="req.id" class="list-group-item p-4 border-bottom hover-bg-light transition-all">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <span class="badge bg-light text-dark border"><i class="bi bi-geo-alt me-1"></i>{{ req.pincode }}</span>
                    <small class="text-muted">{{ formatDate(req.date_of_request) }}</small>
                  </div>
                  <h5 class="fw-bold text-dark mb-2">{{ req.service_name }}</h5>
                  <p class="text-secondary small mb-3"><i class="bi bi-person me-1"></i>{{ req.customer_name }} • {{ req.address }}</p>
                  <p v-if="req.remarks" class="alert alert-light border small py-2 mb-3">
                    <i class="bi bi-info-circle me-1"></i> {{ req.remarks }}
                  </p>
                  <button class="btn btn-success w-100 rounded-pill fw-semibold shadow-sm" @click="acceptRequest(req.id)">
                    Accept Job
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- My Active Jobs Column -->
        <div class="col-lg-6">
          <div class="card border-0 shadow h-100">
            <div class="card-header bg-white border-0 p-4 sticky-top z-1">
              <div class="d-flex align-items-center gap-3 mb-2">
                <div class="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                  <i class="bi bi-calendar-check-fill"></i>
                </div>
                <div>
                  <h5 class="fw-bold mb-0">My Schedule</h5>
                  <small class="text-muted">Manage your assigned tasks</small>
                </div>
              </div>
            </div>
            <div class="card-body p-0 overflow-auto custom-scrollbar" style="max-height: 600px;">
              
              <div v-if="myJobs.length === 0" class="p-5 text-center">
                <i class="bi bi-calendar-x fs-1 text-muted d-block mb-3"></i>
                <h6 class="text-muted">No Active Jobs</h6>
                <p class="small text-muted">Accept a new opportunity to get started.</p>
              </div>

              <div v-else class="list-group list-group-flush">
                <div v-for="job in myJobs" :key="job.id" class="list-group-item p-4 border-bottom">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="badge rounded-pill" 
                          :class="job.status === 'closed' ? 'bg-secondary' : 'bg-primary'">
                      {{ job.status === 'closed' ? 'Completed' : 'In Progress' }}
                    </span>
                    <small class="text-muted fw-bold">#{{ job.id }}</small>
                  </div>
                  
                  <div class="d-flex align-items-center mb-3">
                    <div class="bg-light rounded-circle p-2 me-3">
                      <i class="bi bi-person fs-5 text-secondary"></i>
                    </div>
                    <div>
                      <h6 class="fw-bold mb-0">{{ job.customer_name }}</h6>
                      <a :href="'tel:' + job.customer_phone" class="text-decoration-none small text-success">
                        <i class="bi bi-telephone-fill me-1"></i>{{ job.customer_phone }}
                      </a>
                    </div>
                  </div>

                  <div class="mb-3">
                    <p class="mb-1 small text-muted"><i class="bi bi-geo-alt-fill me-1 text-danger"></i>{{ job.address }} - {{ job.pincode }}</p>
                    <p v-if="job.remarks" class="mb-0 small text-muted fst-italic">"{{ job.remarks }}"</p>
                  </div>

                  <div v-if="job.status === 'assigned'" class="d-grid gap-2 d-md-flex mt-3">
                    <button class="btn btn-outline-danger btn-sm flex-grow-1 rounded-pill" @click="rejectRequest(job.id)">
                      Reject/Cancel
                    </button>
                    <button class="btn btn-success btn-sm flex-grow-1 rounded-pill fw-semibold shadow-sm" @click="closeJob(job.id)">
                      Mark Completed <i class="bi bi-check-lg ms-1"></i>
                    </button>
                  </div>
                  <div v-else class="mt-3 p-2 bg-light rounded text-center small text-muted">
                    <span v-if="job.rating">Rated: <i class="bi bi-star-fill text-warning"></i> {{ job.rating }}/5</span>
                    <span v-else>Waiting for customer rating...</span>
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
      availableRequests: [],
      myJobs: []
    };
  },
  mounted() {
    this.fetchProfile();
    this.fetchAvailableRequests();
    this.fetchMyJobs();
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
      const response = await this.fetchWithAuth('/api/prof/profile');
      if (response && response.ok) {
        this.profile = await response.json();
      }
    },

    async fetchAvailableRequests() {
      const response = await this.fetchWithAuth('/api/prof/available_requests');
      if (response && response.ok) {
        this.availableRequests = await response.json();
      }
    },

    async fetchMyJobs() {
      const response = await this.fetchWithAuth('/api/prof/my_jobs');
      if (response && response.ok) {
        this.myJobs = await response.json();
      }
    },

    async acceptRequest(id) {
      if (!confirm('Accept this job?')) return;
      const response = await this.fetchWithAuth(`/api/prof/request/${id}/accept`, { method: 'POST' });
      if (response && response.ok) {
        this.fetchAvailableRequests();
        this.fetchMyJobs();
        // Optional: Show toast or alert
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to accept');
      }
    },

    async rejectRequest(id) {
      if (!confirm('Are you sure you want to cancel this job? It will be returned to the pool.')) return;
      const response = await this.fetchWithAuth(`/api/prof/request/${id}/reject`, { method: 'POST' });
      if (response && response.ok) {
        this.fetchAvailableRequests();
        this.fetchMyJobs();
      }
    },

    async closeJob(id) {
      if (!confirm('Mark job as completed? This action cannot be undone.')) return;
      const response = await this.fetchWithAuth(`/api/prof/job/${id}/close`, { method: 'POST' });
      if (response && response.ok) {
        this.fetchMyJobs();
      }
    },

    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    },

    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
};