export default {
  template: `
  <div class="admin-dashboard container-fluid vh-100 d-flex flex-column bg-light">
    <link rel="stylesheet" href="../static/css/nav.css">
    <nav class="navbar navbar-expand-lg navbar-dark nav-color fixed-top">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center" to="/admin">
          <i class="bi bi-house-heart-fill me-2 fs-4"></i>
          <span class="fw-bold fs-4">HouseSync Admin</span>
        </router-link>
        <div class="d-flex align-items-center">
          <div class="me-3">
            <router-link to="/admin_search" class="btn btn-light">
              <i class="bi bi-search"></i>
              <span >Search</span>
            </router-link>
          </div>
          <div class="me-3">
            <router-link to="/admin_summary" class="btn btn-dark">
              <i class="bi bi-file-text"></i>
              <span>Summary</span>
            </router-link>
          </div>
          <button class="btn btn-danger" @click="logout">
            <i class="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </div>
    </nav>

    <div class="container mt-5 pt-4">
      <div class="card shadow-lg mb-4">
        <div class="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 class="mb-0">Services Management</h5>
          <button class="btn btn-success" @click="showAddServiceModal">
            <i class="bi bi-plus-circle me-1"></i> Create Service
          </button>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Service Name</th>
                  <th>Base Price (₹)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="service in services" :key="service.id">
                  <td>{{ service.id }}</td>
                  <td>{{ service.name }}</td>
                  <td>{{ service.price }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-1">
                      <i class="bi bi-pencil"></i>
                      <span>Edit</span>
                    </button>
                    <button class="btn btn-sm btn-outline-danger">
                      <i class="bi bi-trash"></i>
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Professional Approvals Section -->
      <div class="card shadow-lg mb-4">
        <div class="card-header bg-white">
          <h5 class="mb-0">Professional Approvals</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Service Type</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="pro in professionals" :key="pro.id">
                  <td>{{ pro.id }}</td>
                  <td>{{ pro.name }}</td>
                  <td>{{ pro.email }}</td>
                  <td>{{ pro.serviceType }}</td>
                  <td>{{ pro.experience }} yrs</td>
                  <td>
                    <span :class="'badge bg-' + (pro.status === 'Pending' ? 'warning' : 'success')">
                      {{ pro.status }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-success me-1" @click="approveProfessional(pro.id)">
                      <i class="bi bi-check"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger me-1" @click="rejectProfessional(pro.id)">
                      <i class="bi bi-x"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" @click="deleteProfessional(pro.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Service Requests Section -->
      <div class="card shadow-lg">
        <div class="card-header bg-white">
          <h5 class="mb-0">Service Requests</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Professional</th>
                  <th>Request Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="request in serviceRequests" :key="request.id">
                  <td>{{ request.id }}</td>
                  <td>{{ request.service }}</td>
                  <td>{{ request.customer }}</td>
                  <td>{{ request.professional || 'Unassigned' }}</td>
                  <td>{{ formatDate(request.date) }}</td>
                  <td>
                    <span :class="'badge bg-' + getStatusColor(request.status)">
                      {{ request.status }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary">
                      <i class="bi bi-eye"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Service Modal -->
    <div class="modal fade" id="addServiceModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create New Service</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addNewService">
              <div class="mb-3">
                <label class="form-label">Service Name</label>
                <input type="text" class="form-control" v-model="newService.name" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" v-model="newService.description" rows="3"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Base Price (₹)</label>
                <input type="number" class="form-control" v-model="newService.price" required>
              </div>
              <button type="submit" class="btn btn-primary w-100">Create Service</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      services: [
        { id: 1, name: "Plumbing", price: 800},
        { id: 2, name: "Electrical", price: 600},
        { id: 3, name: "Cleaning", price: 400},
        { id: 4, name: "Carpentry", price: 700}
      ],
      professionals: [
        { id: 101, name: "John Smith", email: "john@example.com", serviceType: "Plumbing", experience: 5, status: "Pending" },
        { id: 102, name: "Sarah Johnson", email: "sarah@example.com", serviceType: "Electrical", experience: 3, status: "Pending" },
        { id: 103, name: "Mike Brown", email: "mike@example.com", serviceType: "Cleaning", experience: 2, status: "Approved" },
        { id: 104, name: "Emily Davis", email: "emily@example.com", serviceType: "Carpentry", experience: 4, status: "Pending" }
      ],
      serviceRequests: [
        { id: 1001, service: "Plumbing", customer: "Robert Wilson", professional: "John Smith", date: "2023-05-15", status: "Completed" },
        { id: 1002, service: "Electrical", customer: "Lisa Thompson", professional: null, date: "2023-05-16", status: "Pending" },
        { id: 1003, service: "Cleaning", customer: "David Miller", professional: "Mike Brown", date: "2023-05-16", status: "In Progress" },
        { id: 1004, service: "Carpentry", customer: "Anna Clark", professional: null, date: "2023-05-17", status: "Pending" }
      ],
      newService: {
        name: '',
        description: '',
        price: '',
      }
    }
  },
  methods: {
    logout() {
      this.$router.push('/login');
    },
    showAddServiceModal() {
      new bootstrap.Modal(document.getElementById('addServiceModal')).show();
    },
    approveProfessional(id) {
      const pro = this.professionals.find(p => p.id === id);
      if (pro) {
        pro.status = "Approved";
      }
    },
    rejectProfessional(id) {
      const pro = this.professionals.find(p => p.id === id);
      if (pro) {
        pro.status = "Rejected";
      }
    },
    deleteProfessional(id) {
      this.professionals = this.professionals.filter(p => p.id !== id);
    },
    addNewService() {
      const newId = Math.max(...this.services.map(s => s.id)) + 1;
      this.services.push({
        id: newId,
        ...this.newService
      });
      this.newService = { name: '', description: '', price: '', duration: '' };
      bootstrap.Modal.getInstance(document.getElementById('addServiceModal')).hide();
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
    getStatusColor(status) {
      const statusColors = {
        'Pending': 'warning',
        'In Progress': 'info',
        'Completed': 'success',
        'Cancelled': 'danger'
      };
      return statusColors[status] || 'secondary';
    }
  },
};