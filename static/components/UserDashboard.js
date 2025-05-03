export default {
  template: `
    <div class="user-dashboard container-fluid vh-100 d-flex flex-column bg-light">
    <link rel="stylesheet" href="../static/css/nav.css">
      <nav class="navbar navbar-expand-lg navbar-dark nav-color fixed-top">
        <div class="container">
          <router-link class="navbar-brand d-flex align-items-center" to="/user">
            <i class="bi bi-house-heart me-2 fs-4"></i>
            <span class="fw-bold fs-4">HouseSync User</span>
          </router-link>
          <div class="d-flex align-items-center ms-auto">
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
        </div>
      </nav>
  
      <div class="container mt-5 pt-4">
        <div class="card shadow-lg mb-4">
          <div class="card-header bg-white">
            <h5 class="mb-0">Available Services</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div v-for="service in services" :key="service.id" class="col-md-4 mb-4">
                <div class="card h-100">
                  <div class="card-body">
                    <h5 class="card-title">{{ service.name }}</h5>
                    <p class="card-text">{{ service.description }}</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="text-muted">{{ service.duration }} hours</span>
                      <span class="fw-bold">{{ service.price }}</span>
                    </div>
                  </div>
                  <div class="card-footer bg-white border-top-0">
                    <button class="btn btn-primary w-100" @click="requestService(service.id)">
                      <i class="bi bi-calendar-plus me-1"></i> Request Service
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- My Requests Section -->
        <div class="card shadow-lg mb-4">
          <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">My Service Requests</h5>
            <router-link to="/user/requests" class="btn btn-outline-primary">
              View All Requests
            </router-link>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Service</th>
                    <th>Professional</th>
                    <th>Request Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="request in myRequests" :key="request.id">
                    <td>{{ request.id }}</td>
                    <td>{{ request.service }}</td>
                    <td>{{ request.professional || 'Not assigned' }}</td>
                    <td>{{ formatDate(request.date) }}</td>
                    <td>
                      <span :class="'badge bg-' + getStatusColor(request.status)">
                        {{ request.status }}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary me-1" @click="viewRequest(request.id)">
                        <i class="bi bi-eye"></i>
                      </button>
                      <button 
                        class="btn btn-sm btn-outline-danger" 
                        @click="cancelRequest(request.id)"
                        :disabled="request.status !== 'Pending'"
                      >
                        <i class="bi bi-x-circle"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
  
      <!-- Service Request Modal -->
      <div class="modal fade" id="serviceRequestModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Request {{ selectedService?.name }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="submitServiceRequest">
                <div class="mb-3">
                  <label class="form-label">Service Details</label>
                  <textarea class="form-control" v-model="serviceRequest.details" rows="3" required></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Preferred Date</label>
                  <input type="date" class="form-control" v-model="serviceRequest.date" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Preferred Time</label>
                  <input type="time" class="form-control" v-model="serviceRequest.time" required>
                </div>
                <div class="mb-3">
                  <label class="form-label">Address</label>
                  <input type="text" class="form-control" v-model="serviceRequest.address" required>
                </div>
                <button type="submit" class="btn btn-primary w-100">Submit Request</button>
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
        {
          id: 1,
          name: "Plumbing Repair",
          description:
            "Fix leaks, install fixtures, and other plumbing services",
          duration: 2,
          price: 50,
        },
        {
          id: 2,
          name: "Electrical Work",
          description: "Wiring, installations, and electrical repairs",
          duration: 3,
          price: 65,
        },
        {
          id: 3,
          name: "Home Cleaning",
          description: "Thorough cleaning of your entire home",
          duration: 4,
          price: 80,
        },
      ],
      myRequests: [
        {
          id: 1001,
          service: "Plumbing Repair",
          professional: "John Smith",
          date: "2023-05-15",
          status: "Completed",
        },
        {
          id: 1002,
          service: "Electrical Work",
          professional: null,
          date: "2023-05-18",
          status: "Pending",
        },
      ],
      recommendedPros: [
        {
          id: 101,
          name: "John Smith",
          serviceType: "Plumbing",
          rating: 4.8,
          reviews: 124,
          experience: 5,
        },
        {
          id: 102,
          name: "Sarah Johnson",
          serviceType: "Electrical",
          rating: 4.9,
          reviews: 89,
          experience: 7,
        },
      ],
      selectedService: null,
      serviceRequest: {
        details: "",
        date: "",
        time: "",
        address: "",
      },
    };
  },
  methods: {
    logout() {
      this.$router.push("/login");
    },
    requestService(serviceId) {
      this.selectedService = this.services.find((s) => s.id === serviceId);
      this.serviceRequest = {
        details: "",
        date: "",
        time: "",
        address: "",
      };
      new bootstrap.Modal(
        document.getElementById("serviceRequestModal")
      ).show();
    },
    submitServiceRequest() {
      const newId = Math.max(...this.myRequests.map((r) => r.id)) + 1;
      this.myRequests.unshift({
        id: newId,
        service: this.selectedService.name,
        professional: null,
        date: new Date().toISOString().split("T")[0],
        status: "Pending",
      });
      bootstrap.Modal.getInstance(
        document.getElementById("serviceRequestModal")
      ).hide();
    },
    viewRequest(requestId) {
      this.$router.push(`/user/requests/${requestId}`);
    },
    cancelRequest(requestId) {
      const request = this.myRequests.find((r) => r.id === requestId);
      if (request) {
        request.status = "Cancelled";
      }
    },
    viewProfessional(proId) {
      this.$router.push(`/user/professionals/${proId}`);
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
    getStatusColor(status) {
      const statusColors = {
        Pending: "warning",
        Assigned: "info",
        "In Progress": "primary",
        Completed: "success",
        Cancelled: "danger",
      };
      return statusColors[status] || "secondary";
    },
  },
};
