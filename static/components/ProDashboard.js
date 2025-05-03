export default {
  template: `
  <div class="professional-dashboard container-fluid vh-100 d-flex flex-column bg-light">
    <!-- Professional Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow-sm py-2">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center" to="/professional">
          <i class="bi bi-tools me-2 fs-4"></i>
          <span class="fw-bold fs-4">HouseSync Pro</span>
        </router-link>
        
        <!-- Right-side Navigation -->
        <div class="d-flex align-items-center ms-auto">
          <!-- Search Bar -->
          <div class="input-group me-3" style="width: 250px;">
            <input type="text" class="form-control" placeholder="Search requests...">
            <button class="btn btn-light" type="button">
              <i class="bi bi-search"></i>
            </button>
          </div>
          
          <!-- Professional Dropdown -->
          <div class="dropdown me-3">
            <button class="btn btn-light dropdown-toggle" type="button" id="proDropdown" data-bs-toggle="dropdown">
              <i class="bi bi-person-badge me-1"></i> My Account
            </button>
            <ul class="dropdown-menu">
              <li><router-link class="dropdown-item" to="/professional/profile">Profile</router-link></li>
              <li><router-link class="dropdown-item" to="/professional/settings">Settings</router-link></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#" @click="logout">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container mt-5 pt-4">
      <!-- Available Jobs Section -->
      <div class="card shadow-lg mb-4">
        <div class="card-header bg-white">
          <h5 class="mb-0">Available Service Requests</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div v-for="request in availableRequests" :key="request.id" class="col-md-4 mb-4">
              <div class="card h-100">
                <div class="card-body">
                  <h5 class="card-title">{{ request.service }}</h5>
                  <p class="card-text">{{ request.details }}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted">{{ formatDate(request.date) }} at {{ request.time }}</span>
                    <span class="fw-bold">{{ request.price }}</span>
                  </div>
                  <div class="mt-2">
                    <small class="text-muted">{{ request.address }}</small>
                  </div>
                </div>
                <div class="card-footer bg-white border-top-0">
                  <button class="btn btn-primary w-100" @click="acceptRequest(request.id)">
                    <i class="bi bi-check-circle me-1"></i> Accept Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- My Jobs Section -->
      <div class="card shadow-lg mb-4">
        <div class="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 class="mb-0">My Service Assignments</h5>
          <router-link to="/professional/jobs" class="btn btn-outline-primary">
            View All Jobs
          </router-link>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Service</th>
                  <th>Client</th>
                  <th>Scheduled Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="job in myJobs" :key="job.id">
                  <td>{{ job.id }}</td>
                  <td>{{ job.service }}</td>
                  <td>{{ job.client }}</td>
                  <td>{{ formatDate(job.date) }} at {{ job.time }}</td>
                  <td>
                    <span :class="'badge bg-' + getStatusColor(job.status)">
                      {{ job.status }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-1" @click="viewJobDetails(job.id)">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-success" 
                      @click="updateJobStatus(job.id)"
                      :disabled="job.status === 'Completed' || job.status === 'Cancelled'"
                    >
                      <i class="bi bi-arrow-up-circle"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    <!-- Job Details Modal -->
    <div class="modal fade" id="jobDetailsModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Job Details - {{ selectedJob?.service }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedJob">
              <div class="mb-3">
                <label class="form-label fw-bold">Client:</label>
                <p>{{ selectedJob.client }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Service Details:</label>
                <p>{{ selectedJob.details }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Scheduled Time:</label>
                <p>{{ formatDate(selectedJob.date) }} at {{ selectedJob.time }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Address:</label>
                <p>{{ selectedJob.address }}</p>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Status:</label>
                <select class="form-select" v-model="selectedJob.status" @change="updateJobStatus(selectedJob.id)">
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <button 
                class="btn btn-primary w-100 mt-3" 
                @click="saveJobChanges"
                :disabled="selectedJob.status === 'Completed'"
              >
                Save Changes
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
      availableRequests: [
        {
          id: 2001,
          service: "Plumbing Repair",
          details: "Kitchen sink is leaking and needs repair",
          date: "2023-05-20",
          time: "10:00",
          price: "$50",
          address: "123 Main St, Apt 4B"
        },
        {
          id: 2002,
          service: "Electrical Work",
          details: "Install new ceiling light in living room",
          date: "2023-05-22",
          time: "14:00",
          price: "$65",
          address: "456 Oak Ave"
        },
        {
          id: 2003,
          service: "Home Cleaning",
          details: "Deep cleaning for 2 bedroom apartment",
          date: "2023-05-25",
          time: "09:00",
          price: "$80",
          address: "789 Pine Rd"
        }
      ],
      myJobs: [
        {
          id: 1001,
          service: "Plumbing Repair",
          client: "Michael Brown",
          details: "Bathroom faucet replacement",
          date: "2023-05-15",
          time: "11:00",
          address: "321 Elm St",
          status: "Completed"
        },
        {
          id: 1002,
          service: "Electrical Work",
          client: "Sarah Johnson",
          details: "Outlet installation in home office",
          date: "2023-05-18",
          time: "13:30",
          address: "654 Maple Dr",
          status: "In Progress"
        }
      ],
      selectedJob: null
    }
  },
  methods: {
    logout() {
      this.$router.push('/login');
    },
    acceptRequest(requestId) {
      const request = this.availableRequests.find(r => r.id === requestId);
      if (request) {
        this.myJobs.unshift({
          id: requestId,
          service: request.service,
          client: "New Client",
          details: request.details,
          date: request.date,
          time: request.time,
          address: request.address,
          status: "Assigned"
        });
        this.availableRequests = this.availableRequests.filter(r => r.id !== requestId);
      }
    },
    viewJobDetails(jobId) {
      this.selectedJob = this.myJobs.find(j => j.id === jobId);
      new bootstrap.Modal(document.getElementById('jobDetailsModal')).show();
    },
    updateJobStatus(jobId) {
      const job = this.myJobs.find(j => j.id === jobId);
      if (job) {
        // In a real app, this would update the backend
        console.log(`Updated job ${jobId} status to ${job.status}`);
      }
    },
    saveJobChanges() {
      bootstrap.Modal.getInstance(document.getElementById('jobDetailsModal')).hide();
      // In a real app, this would save changes to the backend
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },
    getStatusColor(status) {
      const statusColors = {
        'Assigned': 'info',
        'In Progress': 'primary',
        'Completed': 'success',
        'Cancelled': 'danger'
      };
      return statusColors[status] || 'secondary';
    }
  }
}
