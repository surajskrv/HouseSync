export default {
  template: `
  <div class="user-dashboard container-fluid min-vh-100 d-flex flex-column bg-light font-sans">
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
      
      <!-- Welcome Section -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card border-0 shadow-sm bg-white">
            <div class="card-body p-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <h4 class="fw-bold text-dark mb-1">Hello, {{ profile.name || 'User' }}!</h4>
                <p class="text-muted mb-0">
                  <i class="bi bi-geo-alt-fill text-danger me-1"></i> {{ profile.address }} - {{ profile.pincode }}
                </p>
              </div>
              <button class="btn btn-primary rounded-pill shadow-sm px-4" @click="scrollToServices">
                <i class="bi bi-plus-lg me-1"></i> New Request
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        
        <!-- My Requests Column -->
        <div class="col-lg-7">
          <div class="card border-0 shadow h-100">
            <div class="card-header bg-white border-0 p-4 sticky-top z-1">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-3">
                  <div class="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                    <i class="bi bi-clock-history"></i>
                  </div>
                  <div>
                    <h5 class="fw-bold mb-0">My Requests</h5>
                    <small class="text-muted">Track your service history</small>
                  </div>
                </div>
                <span class="badge bg-secondary rounded-pill">{{ myRequests.length }} Total</span>
              </div>
            </div>
            <div class="card-body p-0 overflow-auto custom-scrollbar" style="max-height: 600px;">
              
              <div v-if="myRequests.length === 0" class="p-5 text-center">
                <i class="bi bi-clipboard-x fs-1 text-muted d-block mb-3"></i>
                <h6 class="text-muted">No Requests Found</h6>
                <p class="small text-muted">You haven't booked any services yet.</p>
              </div>

              <div v-else class="list-group list-group-flush">
                <div v-for="req in myRequests" :key="req.id" class="list-group-item p-4 border-bottom hover-bg-light transition-all">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 class="fw-bold text-dark mb-1">{{ req.service_name }}</h6>
                      <small class="text-muted">{{ formatDate(req.date_of_request) }}</small>
                    </div>
                    <span class="badge rounded-pill text-uppercase" :class="getStatusClass(req.status)">
                      {{ req.status }}
                    </span>
                  </div>

                  <div v-if="req.professional_name" class="alert alert-light border small py-2 mb-3 d-flex align-items-center">
                    <i class="bi bi-person-check-fill text-success me-2"></i>
                    <div>
                      <strong>{{ req.professional_name }}</strong> is assigned.
                      <span v-if="req.professional_phone" class="text-muted ms-2"><i class="bi bi-telephone me-1"></i>{{ req.professional_phone }}</span>
                    </div>
                  </div>
                  <div v-else-if="req.status === 'requested'" class="alert alert-warning border small py-2 mb-3">
                    <i class="bi bi-hourglass-split me-2"></i> Waiting for a professional...
                  </div>

                  <div class="d-flex justify-content-end gap-2 mt-3">
                    <!-- Actions for requested/assigned jobs -->
                    <button v-if="['requested', 'assigned'].includes(req.status)" class="btn btn-outline-danger btn-sm rounded-pill" @click="cancelRequest(req.id)">
                      Cancel
                    </button>
                    
                    <!-- Actions for completed jobs (Rating) -->
                    <button v-if="req.status === 'closed'" class="btn btn-warning btn-sm rounded-pill text-dark" @click="openRatingModal(req)">
                      Rate Service <i class="bi bi-star-fill ms-1"></i>
                    </button>
                    
                    <!-- Completed with Rating -->
                    <span v-if="req.status === 'completed' && req.rating" class="text-warning small">
                      <i class="bi bi-star-fill"></i> {{ req.rating }}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Available Services Column -->
        <div class="col-lg-5" id="services-section">
          <div class="card border-0 shadow h-100">
            <div class="card-header bg-white border-0 p-4 sticky-top z-1">
              <div class="d-flex align-items-center gap-3 mb-2">
                <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                  <i class="bi bi-grid-fill"></i>
                </div>
                <div>
                  <h5 class="fw-bold mb-0">Book a Service</h5>
                  <small class="text-muted">Choose from our experts</small>
                </div>
              </div>
            </div>
            <div class="card-body p-0 overflow-auto custom-scrollbar" style="max-height: 600px;">
              <div class="list-group list-group-flush">
                <div v-for="service in services" :key="service.id" class="list-group-item p-3 border-bottom hover-bg-light">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="fw-bold mb-0">{{ service.name }}</h6>
                    <span class="badge bg-light text-dark border">₹ {{ service.base_price }}</span>
                  </div>
                  <p class="text-muted small mb-3 text-truncate">{{ service.description }}</p>
                  <button class="btn btn-outline-primary w-100 btn-sm rounded-pill fw-semibold" @click="openBookModal(service)">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Book Service Modal -->
    <div class="modal fade" id="bookModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title fw-bold">Request {{ selectedService?.name }}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <form @submit.prevent="submitRequest">
              <div class="mb-3">
                <label class="form-label small text-muted fw-bold">PREFERRED DATE</label>
                <input type="date" class="form-control" v-model="bookForm.date_of_request" required :min="new Date().toISOString().split('T')[0]">
              </div>
              <div class="mb-3">
                <label class="form-label small text-muted fw-bold">REMARKS / DETAILS</label>
                <textarea class="form-control" v-model="bookForm.remarks" rows="3" placeholder="Describe the issue..."></textarea>
              </div>
              <div class="d-grid mt-4">
                <button type="submit" class="btn btn-primary rounded-pill fw-bold py-2">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Rating Modal -->
    <div class="modal fade" id="ratingModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-warning text-dark">
            <h5 class="modal-title fw-bold">Rate Service</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4 text-center">
            <p class="text-muted mb-4">How was your experience with <strong>{{ selectedRequest?.service_name }}</strong>?</p>
            <div class="mb-4">
              <div class="btn-group" role="group">
                <button v-for="star in 5" :key="star" type="button" class="btn btn-outline-warning" 
                        :class="{ 'active': ratingForm.rating >= star }" 
                        @click="ratingForm.rating = star">
                  <i class="bi bi-star-fill"></i>
                </button>
              </div>
            </div>
            <div class="mb-3 text-start">
              <label class="form-label small text-muted fw-bold">FEEDBACK (OPTIONAL)</label>
              <textarea class="form-control" v-model="ratingForm.remarks" rows="2"></textarea>
            </div>
            <div class="d-grid mt-4">
              <button type="button" class="btn btn-dark rounded-pill fw-bold" @click="submitRating" :disabled="!ratingForm.rating">
                Submit Review
              </button>
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
      services: [],
      myRequests: [],
      selectedService: null,
      selectedRequest: null,
      bookForm: { date_of_request: '', remarks: '' },
      ratingForm: { rating: 0, remarks: '' },
      bookModal: null,
      ratingModal: null
    };
  },
  mounted() {
    this.fetchProfile();
    this.fetchServices();
    this.fetchMyRequests();
    this.bookModal = new bootstrap.Modal(document.getElementById('bookModal'));
    this.ratingModal = new bootstrap.Modal(document.getElementById('ratingModal'));
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

    async fetchServices() {
      const res = await this.fetchWithAuth('/api/user/services');
      if (res && res.ok) this.services = await res.json();
    },

    async fetchMyRequests() {
      const res = await this.fetchWithAuth('/api/user/requests');
      if (res && res.ok) this.myRequests = await res.json();
    },

    openBookModal(service) {
      this.selectedService = service;
      this.bookForm = { date_of_request: new Date().toISOString().split('T')[0], remarks: '' };
      this.bookModal.show();
    },

    async submitRequest() {
      const payload = {
        service_type_id: this.selectedService.id,
        ...this.bookForm
      };
      const res = await this.fetchWithAuth('/api/user/request', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res && res.ok) {
        this.bookModal.hide();
        this.fetchMyRequests();
        alert('Service requested successfully!');
      } else {
        alert('Failed to request service.');
      }
    },

    async cancelRequest(id) {
      if (!confirm('Are you sure you want to cancel this request?')) return;
      const res = await this.fetchWithAuth(`/api/user/request/${id}/cancel`, { method: 'POST' });
      if (res && res.ok) {
        this.fetchMyRequests();
      }
    },

    openRatingModal(req) {
      this.selectedRequest = req;
      this.ratingForm = { rating: 0, remarks: '' };
      this.ratingModal.show();
    },

    async submitRating() {
      const res = await this.fetchWithAuth(`/api/user/request/${this.selectedRequest.id}/close`, {
        method: 'POST',
        body: JSON.stringify(this.ratingForm)
      });
      if (res && res.ok) {
        this.ratingModal.hide();
        this.fetchMyRequests();
      }
    },

    scrollToServices() {
      document.getElementById('services-section').scrollIntoView({ behavior: 'smooth' });
    },

    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString();
    },

    getStatusClass(status) {
      switch(status) {
        case 'requested': return 'bg-warning text-dark';
        case 'assigned': return 'bg-info text-white';
        case 'closed': return 'bg-success text-white'; // Closed by Pro, pending user review
        case 'completed': return 'bg-success text-white'; // Fully done
        case 'cancelled': return 'bg-danger text-white';
        default: return 'bg-secondary text-white';
      }
    },

    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
};