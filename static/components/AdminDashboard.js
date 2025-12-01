export default {
  template: `
  <div class="admin-dashboard container-fluid min-vh-100 d-flex flex-column bg-light font-sans">
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
      
      <!-- Summary Stats Row -->
      <div class="row g-4 mb-5">
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm h-100 py-3 border-start border-4 border-primary">
            <div class="card-body text-center">
              <div class="mb-2 text-primary"><i class="bi bi-tools fs-3"></i></div>
              <h2 class="fw-bold text-dark mb-0">{{ summary.services }}</h2>
              <small class="text-muted text-uppercase fw-bold" style="font-size: 0.75rem; letter-spacing: 1px;">Services</small>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm h-100 py-3 border-start border-4 border-success">
            <div class="card-body text-center">
              <div class="mb-2 text-success"><i class="bi bi-person-badge fs-3"></i></div>
              <h2 class="fw-bold text-dark mb-0">{{ summary.professionals }}</h2>
              <small class="text-muted text-uppercase fw-bold" style="font-size: 0.75rem; letter-spacing: 1px;">Professionals</small>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm h-100 py-3 border-start border-4 border-info">
            <div class="card-body text-center">
              <div class="mb-2 text-info"><i class="bi bi-people fs-3"></i></div>
              <h2 class="fw-bold text-dark mb-0">{{ summary.customers }}</h2>
              <small class="text-muted text-uppercase fw-bold" style="font-size: 0.75rem; letter-spacing: 1px;">Customers</small>
            </div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="card border-0 shadow-sm h-100 py-3 border-start border-4 border-warning">
            <div class="card-body text-center">
              <div class="mb-2 text-warning"><i class="bi bi-clipboard-data fs-3"></i></div>
              <h2 class="fw-bold text-dark mb-0">{{ summary.requests }}</h2>
              <small class="text-muted text-uppercase fw-bold" style="font-size: 0.75rem; letter-spacing: 1px;">Total Requests</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Approvals Section -->
      <div v-if="pendingProfessionals.length > 0" class="card border-0 shadow-lg mb-5 overflow-hidden">
        <div class="card-header bg-warning bg-opacity-10 border-0 p-4 d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <div class="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center me-3 shadow-sm" style="width: 48px; height: 48px;">
              <i class="bi bi-exclamation-lg fs-4"></i>
            </div>
            <div>
              <h5 class="fw-bold mb-0 text-dark">Pending Approvals</h5>
              <small class="text-muted">Review professional registration requests</small>
            </div>
          </div>
          <span class="badge bg-warning text-dark rounded-pill">{{ pendingProfessionals.length }} Pending</span>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="bg-light text-secondary small text-uppercase">
                <tr>
                  <th class="ps-4">Name</th>
                  <th>Email</th>
                  <th>Service Type</th>
                  <th>Experience</th>
                  <th>Phone Number</th>
                  <th class="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pro in pendingProfessionals" :key="pro.id">
                  <td class="ps-4 fw-semibold">{{ pro.name }}</td>
                  <td class="text-muted">{{ pro.email }}</td>
                  <td><span class="badge bg-white text-dark border">{{ pro.service_type }}</span></td>
                  <td>{{ pro.experience }} Years</td>
                  <td>{{ pro.phone }}</td>
                  <td class="text-end pe-4">
                    <button class="btn btn-sm btn-success me-2" @click="verifyProfessional(pro.id)">
                      <i class="bi bi-check-lg me-1"></i> Approve
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="rejectProfessional(pro.id)">
                      <i class="bi bi-x-lg me-1"></i> Reject
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="row g-4">
        
        <!-- Services Management -->
        <div class="col-lg-5">
          <div class="card border-0 shadow h-100">
            <div class="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center sticky-top">
              <div class="d-flex align-items-center gap-3">
                <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                  <i class="bi bi-tools"></i>
                </div>
                <h5 class="fw-bold mb-0">Services</h5>
              </div>
              <button class="btn btn-primary btn-sm rounded-pill px-3 shadow-sm" @click="openServiceModal()">
                <i class="bi bi-plus-lg me-1"></i> Add Service
              </button>
            </div>
            <div class="card-body p-0">
              <div v-if="services.length === 0" class="p-5 text-center text-muted">
                <i class="bi bi-inbox fs-1 d-block mb-2"></i>
                No services available.
              </div>
              <div class="list-group list-group-flush">
                <div v-for="service in services" :key="service.id" class="list-group-item p-3 d-flex justify-content-between align-items-center border-bottom-0 border-top hover-bg-light">
                  <div class="w-75">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <h6 class="fw-bold mb-0 text-truncate">{{ service.name }}</h6>
                      <span class="badge bg-light text-dark border ms-2">₹ {{ service.base_price }}</span>
                    </div>
                    <p class="text-muted small mb-0 text-truncate">{{ service.description }}</p>
                  </div>
                  <div class="d-flex gap-2 ms-2">
                    <button class="btn btn-light btn-sm text-primary" @click="openServiceModal(service)" title="Edit">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-light btn-sm text-danger" @click="deleteService(service.id)" title="Delete">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Management (Preview) -->
        <div class="col-lg-7">
          <div class="card border-0 shadow h-100">
            <div class="card-header bg-white border-0 p-4">
              <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <div class="d-flex align-items-center gap-3">
                  <div class="bg-dark bg-opacity-10 text-dark rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                    <i class="bi bi-people-fill"></i>
                  </div>
                  <h5 class="fw-bold mb-0">Recent Users</h5>
                </div>
                <router-link to="/admin_search" class="btn btn-sm btn-outline-dark rounded-pill">View All</router-link>
              </div>
            </div>
            <div class="card-body p-0 overflow-auto custom-scrollbar" style="max-height: 500px;">
              <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead class="bg-light text-muted small">
                    <tr>
                      <th class="ps-4">User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th class="text-end pe-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in filteredUsers.slice(0, 10)" :key="user.id">
                      <td class="ps-4">
                        <div class="d-flex align-items-center">
                          <div class="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold me-3 shadow-sm" 
                               :class="user.role === 'prof' ? 'bg-success' : 'bg-info'"
                               style="width: 36px; height: 36px; font-size: 0.8rem;">
                            {{ user.role === 'prof' ? 'P' : 'C' }}
                          </div>
                          <div>
                            <div class="fw-semibold text-dark">{{ user.name || 'User' }}</div>
                            <small class="text-muted">{{ user.email }}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="badge rounded-pill fw-normal" 
                              :class="user.role === 'prof' ? 'bg-success bg-opacity-10 text-success' : 'bg-info bg-opacity-10 text-info'">
                          {{ user.role === 'prof' ? 'Professional' : 'Customer' }}
                        </span>
                      </td>
                      <td>
                        <span class="badge rounded-pill fw-normal"
                              :class="user.active ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'">
                          {{ user.active ? 'Active' : 'Blocked' }}
                        </span>
                      </td>
                      <td class="text-end pe-4">
                        <button class="btn btn-sm rounded-pill px-3 fw-medium" 
                                :class="user.active ? 'btn-outline-danger' : 'btn-outline-success'" 
                                @click="toggleUserStatus(user.id)">
                          <i :class="user.active ? 'bi bi-slash-circle' : 'bi bi-check-circle'"></i>
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

    <!-- Create/Edit Service Modal -->
    <div class="modal fade" id="serviceModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title fw-bold">{{ isEditing ? 'Edit Service' : 'Create New Service' }}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="saveService">
              <div class="mb-3">
                <label class="form-label small text-muted fw-bold">SERVICE NAME</label>
                <input type="text" class="form-control" v-model="serviceForm.name" required placeholder="e.g. AC Repair">
              </div>
              <div class="mb-3">
                <label class="form-label small text-muted fw-bold">DESCRIPTION</label>
                <textarea class="form-control" v-model="serviceForm.description" rows="3" placeholder="Brief details about the service..."></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label small text-muted fw-bold">BASE PRICE (₹)</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0">₹</span>
                  <input type="number" class="form-control border-start-0 ps-0" v-model="serviceForm.base_price" required placeholder="0.00" min="0" step="0.01">
                </div>
              </div>
              <div class="d-grid mt-4">
                <button type="submit" class="btn btn-primary rounded-pill fw-bold py-2">
                  {{ isEditing ? 'Update Service' : 'Create Service' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
  `,
  data() {
    return {
      summary: { services: 0, professionals: 0, customers: 0, requests: 0 },
      services: [],
      users: [],
      searchQuery: '',
      isEditing: false,
      serviceForm: { id: null, name: '', description: '', base_price: '' },
      modalInstance: null,
    };
  },
  computed: {
    pendingProfessionals() {
      return this.users.filter(u => u.role === 'prof' && u.status === 'Pending');
    },
    filteredUsers() {
      return this.users.filter(u => {
        // Exclude pending professionals
        if (u.role === 'prof' && u.status === 'Pending') return false;
        
        const query = this.searchQuery.toLowerCase();
        return (
          (u.name && u.name.toLowerCase().includes(query)) || 
          (u.email && u.email.toLowerCase().includes(query))
        );
      });
    }
  },
  mounted() {
    this.fetchSummary();
    this.fetchServices();
    this.fetchUsers();
    this.modalInstance = new bootstrap.Modal(document.getElementById('serviceModal'));
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

    async fetchSummary() {
      try {
        const response = await fetch("/api/admin/summary", {
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
        this.summary = data;
      } catch (err) {
        console.error("Error fetching summary", err);
      }
    },

    async fetchServices() {
      try {
        const response = await fetch("/api/services", {
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
        this.services = data;
      } catch (err) {
        console.error("Error fetching services", err);
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

    openServiceModal(service = null) {
      if (service) {
        this.isEditing = true;
        this.serviceForm = { ...service };
      } else {
        this.isEditing = false;
        this.serviceForm = { id: null, name: '', description: '', base_price: '' };
      }
      this.modalInstance.show();
    },

    async saveService() {
      try {
        const url = this.isEditing 
          ? `/api/services/${this.serviceForm.id}` 
          : '/api/services';
        const method = this.isEditing ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            "Auth-Token": localStorage.getItem("auth_token")
          },
          body: JSON.stringify(this.serviceForm)
        });

        if (response.status === 401 || response.status === 403) {
          this.logout();
          return;
        }

        if (response.ok) {
          this.modalInstance.hide();
          this.fetchServices();
          this.fetchSummary();
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Failed to save service');
        }
      } catch (err) {
        console.error("Error saving service", err);
      }
    },

    async deleteService(id) {
      if (!confirm('Are you sure you want to delete this service?')) return;
      try {
        const response = await fetch(`/api/services/${id}`, {
          method: 'DELETE',
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
          this.fetchServices();
          this.fetchSummary();
        }
      } catch (err) {
        console.error("Error deleting service", err);
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

    async verifyProfessional(id) {
      try {
        const response = await fetch(`/api/admin/professional/${id}/verify`, {
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
          this.fetchSummary();
        }
      } catch (err) {
        console.error("Error verifying professional", err);
      }
    },

    async rejectProfessional(id) {
      if (!confirm('Reject and delete this professional application?')) return;
      try {
        const response = await fetch(`/api/admin/professional/${id}/reject`, {
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
          this.fetchSummary();
        }
      } catch (err) {
        console.error("Error rejecting professional", err);
      }
    },

    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
};