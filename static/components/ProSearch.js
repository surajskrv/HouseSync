export default {
  template: `
  <div class="pro-search container-fluid min-vh-100 d-flex flex-column bg-light font-sans">
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
        <div class="col-lg-10">
          
          <div class="text-center mb-5">
            <h2 class="fw-bold text-dark">Find Jobs</h2>
            <p class="text-muted">Search through available requests or your job history</p>
          </div>

          <!-- Search Filter -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-4">
              <div class="row g-3">
                <div class="col-md-8">
                  <div class="input-group input-group-lg">
                    <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
                    <input type="text" class="form-control border-start-0 ps-0" placeholder="Search by location, customer name..." v-model="searchQuery">
                  </div>
                </div>
                <div class="col-md-4">
                  <select class="form-select form-select-lg" v-model="filterType">
                    <option value="available">Available Jobs</option>
                    <option value="my_jobs">My History</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Results -->
          <div class="card border-0 shadow">
            <div class="card-body p-0">
              <div v-if="filteredJobs.length === 0" class="p-5 text-center text-muted">
                <i class="bi bi-emoji-frown fs-1 d-block mb-3"></i>
                No jobs found matching your criteria.
              </div>
              <div class="list-group list-group-flush">
                <div v-for="job in filteredJobs" :key="job.id" class="list-group-item p-4 border-bottom hover-bg-light">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 class="fw-bold mb-1">{{ job.service_name || 'Service Request' }}</h5>
                      <p class="text-muted mb-2"><i class="bi bi-person me-1"></i> {{ job.customer_name }}</p>
                      <span class="badge bg-light text-dark border me-2"><i class="bi bi-geo-alt me-1"></i>{{ job.pincode }}</span>
                      <span class="badge bg-light text-dark border">{{ formatDate(job.date_of_request) }}</span>
                    </div>
                    <div class="text-end">
                      <span v-if="filterType === 'my_jobs'" class="badge rounded-pill mb-2 d-block" 
                            :class="job.status === 'closed' ? 'bg-success' : 'bg-primary'">
                        {{ job.status }}
                      </span>
                      <button v-if="filterType === 'available'" class="btn btn-sm btn-success rounded-pill fw-semibold" @click="acceptRequest(job.id)">
                        Accept
                      </button>
                    </div>
                  </div>
                  <div class="mt-2 text-muted small">
                    <i class="bi bi-house-door me-1"></i> {{ job.address }}
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
      searchQuery: '',
      filterType: 'available',
      availableRequests: [],
      myJobs: []
    };
  },
  computed: {
    filteredJobs() {
      const list = this.filterType === 'available' ? this.availableRequests : this.myJobs;
      if (!this.searchQuery) return list;
      
      const query = this.searchQuery.toLowerCase();
      return list.filter(job => 
        (job.customer_name && job.customer_name.toLowerCase().includes(query)) ||
        (job.address && job.address.toLowerCase().includes(query)) ||
        (job.pincode && job.pincode.includes(query))
      );
    }
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    filterType() {
      this.fetchData();
    }
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

    async fetchData() {
      if (this.filterType === 'available') {
        const res = await this.fetchWithAuth('/api/prof/available_requests');
        if (res && res.ok) this.availableRequests = await res.json();
      } else {
        const res = await this.fetchWithAuth('/api/prof/my_jobs');
        if (res && res.ok) this.myJobs = await res.json();
      }
    },

    async acceptRequest(id) {
      if (!confirm('Accept this job?')) return;
      const res = await this.fetchWithAuth(`/api/prof/request/${id}/accept`, { method: 'POST' });
      if (res && res.ok) {
        this.fetchData(); 
        alert('Job accepted! Check your Dashboard.');
      }
    },

    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString();
    },

    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
};