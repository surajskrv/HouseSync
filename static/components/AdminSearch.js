export default {
  template: `
  <div class="admin-search container-fluid min-vh-100 d-flex flex-column bg-light font-sans">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm border-bottom border-secondary">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center gap-2" to="/admin_dashboard">
          <i class="bi bi-shield-lock-fill fs-4 text-primary"></i>
          <span class="fw-bold fs-4 tracking-tight">Admin Portal</span>
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="adminNav">
          <ul class="navbar-nav ms-auto align-items-center gap-3">
            <li class="nav-item">
              <router-link to="/admin_dashboard" class="nav-link" active-class="active">
                <i class="bi bi-speedometer2 me-1"></i> Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin_search" class="nav-link" active-class="active">
                <i class="bi bi-search me-1"></i> Search
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin_summary" class="nav-link" active-class="active">
                <i class="bi bi-bar-chart-line me-1"></i> Summary
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
            <h2 class="fw-bold text-dark">Search Users</h2>
            <p class="text-muted">Find and manage professionals and customers</p>
          </div>

          <!-- Search & Filter Card -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-4">
              <div class="row g-3">
                <div class="col-md-7">
                  <div class="input-group input-group-lg">
                    <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
                    <input type="text" class="form-control border-start-0 ps-0" placeholder="Search by name, email, or service..." v-model="searchQuery">
                  </div>
                </div>
                <div class="col-md-3">
                  <select class="form-select form-select-lg" v-model="roleFilter">
                    <option value="all">All Roles</option>
                    <option value="prof">Professionals</option>
                    <option value="client">Customers</option>
                  </select>
                </div>
                <div class="col-md-2">
                  <select class="form-select form-select-lg" v-model="statusFilter">
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Results Section -->
          <div class="card border-0 shadow">
            <div class="card-header bg-white border-0 p-4">
              <h5 class="fw-bold mb-0">Results <span class="text-muted fw-normal">({{ filteredUsers.length }})</span></h5>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="bg-light text-muted small text-uppercase">
                    <tr>
                      <th class="ps-4">User</th>
                      <th>Details</th>
                      <th>Status</th>
                      <th class="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="filteredUsers.length === 0">
                      <td colspan="4" class="text-center py-5 text-muted">
                        <i class="bi bi-emoji-frown fs-1 d-block mb-3"></i>
                        No users found matching criteria.
                      </td>
                    </tr>
                    <tr v-for="user in filteredUsers" :key="user.id">
                      <td class="ps-4">
                        <div class="d-flex align-items-center">
                          <div class="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold me-3 shadow-sm" 
                               :class="user.role === 'prof' ? 'bg-success' : 'bg-info'"
                               style="width: 48px; height: 48px;">
                            {{ user.role === 'prof' ? 'P' : 'C' }}
                          </div>
                          <div>
                            <h6 class="mb-0 fw-bold">{{ user.name || 'Unknown' }}</h6>
                            <small class="text-muted">{{ user.email }}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div v-if="user.role === 'prof'">
                          <span class="badge bg-light text-dark border me-1">{{ user.service_type }}</span>
                          <span class="text-muted small">{{ user.experience }} yrs exp</span>
                        </div>
                        <div v-else>
                          <span class="text-muted small"><i class="bi bi-geo-alt me-1"></i>{{ user.address || 'No address' }}</span>
                        </div>
                      </td>
                      <td>
                        <span class="badge rounded-pill"
                              :class="user.active ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'">
                          {{ user.active ? 'Active' : 'Blocked' }}
                        </span>
                      </td>
                      <td class="text-end pe-4">
                        <button class="btn btn-sm px-3 rounded-pill fw-medium"
                                :class="user.active ? 'btn-outline-danger' : 'btn-outline-success'"
                                @click="toggleUserStatus(user.id)">
                          <i :class="user.active ? 'bi bi-slash-circle me-1' : 'bi bi-check-circle me-1'"></i>
                          {{ user.active ? 'Block' : 'Unblock' }}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
      users: [],
      searchQuery: '',
      roleFilter: 'all',
      statusFilter: 'all'
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => {
        // 1. Search Query
        const query = this.searchQuery.toLowerCase();
        const matchesSearch = 
          (user.name && user.name.toLowerCase().includes(query)) ||
          (user.email && user.email.toLowerCase().includes(query)) ||
          (user.service_type && user.service_type.toLowerCase().includes(query));

        // 2. Role Filter
        const matchesRole = this.roleFilter === 'all' || user.role === this.roleFilter;

        // 3. Status Filter
        let matchesStatus = true;
        if (this.statusFilter === 'active') matchesStatus = user.active;
        if (this.statusFilter === 'blocked') matchesStatus = !user.active;

        // Exclude pending professionals (handled in Dashboard)
        const isNotPending = !(user.role === 'prof' && user.status === 'Pending');

        return matchesSearch && matchesRole && matchesStatus && isNotPending;
      });
    }
  },
  mounted() {
    this.fetchUsers();
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

    async fetchUsers() {
      try {
        const response = await fetch("/api/admin/users", {
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token")
          },
        });
        if (response.status === 401 || response.status === 403) {
          this.logout();
          return;
        }
        const data = await response.json();
        this.users = data;
      } catch (err) {
        console.error("Error fetching users", err);
      }
    },

    async toggleUserStatus(id) {
      try {
        const response = await fetch(`/api/admin/user/${id}/toggle_status`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token")
          },
        });

        if (response.status === 401 || response.status === 403) {
          this.logout();
          return;
        }

        if (response.ok) {
          this.fetchUsers();
        }
      } catch (err) {
        console.error("Error toggling user status", err);
      }
    },

    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
};