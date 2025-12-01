export default {
  template: `
  <div class="user-search container-fluid min-vh-100 d-flex flex-column bg-light font-sans">
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
        <div class="col-lg-10">
          
          <div class="text-center mb-5">
            <h2 class="fw-bold text-dark">Search Services</h2>
            <p class="text-muted">Find available services or search your history</p>
          </div>

          <!-- Search Filter -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-4">
              <div class="row g-3">
                <div class="col-md-8">
                  <div class="input-group input-group-lg">
                    <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
                    <input type="text" class="form-control border-start-0 ps-0" placeholder="Search by service name, description..." v-model="searchQuery">
                  </div>
                </div>
                <div class="col-md-4">
                  <select class="form-select form-select-lg" v-model="filterType">
                    <option value="services">New Services</option>
                    <option value="history">My History</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Results -->
          <div class="card border-0 shadow">
            <div class="card-body p-0">
              <div v-if="filteredList.length === 0" class="p-5 text-center text-muted">
                <i class="bi bi-emoji-frown fs-1 d-block mb-3"></i>
                No results found matching your criteria.
              </div>
              
              <!-- Services List -->
              <div v-if="filterType === 'services'" class="list-group list-group-flush">
                <div v-for="item in filteredList" :key="item.id" class="list-group-item p-4 border-bottom hover-bg-light">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 class="fw-bold mb-1">{{ item.name }}</h5>
                      <p class="text-muted mb-0 small">{{ item.description }}</p>
                    </div>
                    <div class="text-end">
                      <span class="badge bg-light text-dark border mb-2 d-block">₹ {{ item.base_price }}</span>
                      <button class="btn btn-sm btn-outline-primary rounded-pill fw-semibold" @click="requestService(item)">
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- History List -->
              <div v-else class="list-group list-group-flush">
                <div v-for="item in filteredList" :key="item.id" class="list-group-item p-4 border-bottom hover-bg-light">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 class="fw-bold mb-1">{{ item.service_name }}</h5>
                      <p class="text-muted mb-0 small">{{ formatDate(item.date_of_request) }}</p>
                    </div>
                    <span class="badge rounded-pill" 
                          :class="item.status === 'completed' ? 'bg-success' : 'bg-warning text-dark'">
                      {{ item.status }}
                    </span>
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
      filterType: 'services',
      services: [],
      history: []
    };
  },
  computed: {
    filteredList() {
      const list = this.filterType === 'services' ? this.services : this.history;
      if (!this.searchQuery) return list;
      
      const query = this.searchQuery.toLowerCase();
      return list.filter(item => {
        if (this.filterType === 'services') {
          return (item.name && item.name.toLowerCase().includes(query)) ||
                 (item.description && item.description.toLowerCase().includes(query));
        } else {
          return (item.service_name && item.service_name.toLowerCase().includes(query)) ||
                 (item.status && item.status.toLowerCase().includes(query));
        }
      });
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
      if (this.filterType === 'services') {
        const res = await this.fetchWithAuth('/api/user/services');
        if (res && res.ok) this.services = await res.json();
      } else {
        const res = await this.fetchWithAuth('/api/user/requests');
        if (res && res.ok) this.history = await res.json();
      }
    },

    requestService(service) {
      // For simplicity in search, we redirect to dashboard with query or just alert
      // Ideally, pass data to dashboard via route query
      alert('Please go to Dashboard to complete the booking for ' + service.name);
      this.$router.push('/user_dashboard');
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