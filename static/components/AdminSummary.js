export default {
  template: `
  <div class="admin-summary container-fluid min-vh-100 d-flex flex-column bg-light font-sans">
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
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 class="fw-bold text-dark mb-1">Analytics Summary</h2>
          <p class="text-muted">Overview of platform performance and service metrics</p>
        </div>
        <button class="btn btn-primary shadow-sm" @click="printReport">
          <i class="bi bi-printer me-2"></i> Print Report
        </button>
      </div>

      <!-- Charts Row -->
      <div class="row g-4 mb-4">
        
        <!-- Status Bar Chart -->
        <div class="col-lg-6">
          <div class="card border-0 shadow h-100">
            <div class="card-header bg-white border-0 pt-4 px-4 pb-0">
              <h5 class="fw-bold mb-0">Service Request Status</h5>
              <small class="text-muted">Current status of all service requests</small>
            </div>
            <div class="card-body">
              <div class="chart-container" style="position: relative; height: 300px;">
                <canvas id="statusChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Pie Chart -->
        <div class="col-lg-6">
          <div class="card border-0 shadow h-100">
            <div class="card-header bg-white border-0 pt-4 px-4 pb-0">
              <h5 class="fw-bold mb-0">Revenue by Service Type</h5>
              <small class="text-muted">Total generated revenue distribution</small>
            </div>
            <div class="card-body">
              <div class="chart-container" style="position: relative; height: 300px;">
                <canvas id="revenueChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Demand Line Chart (Simulated for Visual) -->
      <div class="row g-4">
        <div class="col-12">
          <div class="card border-0 shadow h-100">
            <div class="card-header bg-white border-0 pt-4 px-4 pb-0">
              <h5 class="fw-bold mb-0">Service Popularity</h5>
              <small class="text-muted">Number of requests per service category</small>
            </div>
            <div class="card-body">
              <div class="chart-container" style="position: relative; height: 300px;">
                <canvas id="popularityChart"></canvas>
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
      stats: null,
      charts: {}
    };
  },
  mounted() {
    this.loadChartJs().then(() => {
      this.fetchStats();
    });
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

    async fetchStats() {
      try {
        const response = await this.fetchWithAuth('/api/admin/stats');
        if (response && response.ok) {
          const data = await response.json();
          this.stats = data;
          this.renderCharts();
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    },

    loadChartJs() {
      return new Promise((resolve, reject) => {
        if (window.Chart) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    },

    renderCharts() {
      if (!this.stats) return;

      const { request_status, service_performance } = this.stats;

      // 1. Status Bar Chart
      const ctxStatus = document.getElementById('statusChart').getContext('2d');
      this.charts.status = new Chart(ctxStatus, {
        type: 'bar',
        data: {
          labels: request_status.labels,
          datasets: [{
            label: 'Number of Requests',
            data: request_status.data,
            backgroundColor: [
              'rgba(255, 193, 7, 0.7)', // Pending/Requested - Warning
              'rgba(13, 202, 240, 0.7)', // Assigned - Info
              'rgba(25, 135, 84, 0.7)',  // Closed - Success
              'rgba(220, 53, 69, 0.7)'   // Cancelled - Danger
            ],
            borderColor: [
              'rgba(255, 193, 7, 1)',
              'rgba(13, 202, 240, 1)',
              'rgba(25, 135, 84, 1)',
              'rgba(220, 53, 69, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } }
          }
        }
      });

      // 2. Revenue Pie Chart
      const ctxRevenue = document.getElementById('revenueChart').getContext('2d');
      this.charts.revenue = new Chart(ctxRevenue, {
        type: 'doughnut',
        data: {
          labels: service_performance.labels,
          datasets: [{
            data: service_performance.revenue,
            backgroundColor: [
              '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed !== null) {
                    label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed);
                  }
                  return label;
                }
              }
            }
          }
        }
      });

      // 3. Popularity Bar Chart (Horizontal)
      const ctxPopularity = document.getElementById('popularityChart').getContext('2d');
      this.charts.popularity = new Chart(ctxPopularity, {
        type: 'bar',
        data: {
          labels: service_performance.labels,
          datasets: [{
            label: 'Total Requests',
            data: service_performance.counts,
            backgroundColor: 'rgba(78, 115, 223, 0.7)',
            borderColor: 'rgba(78, 115, 223, 1)',
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { beginAtZero: true, ticks: { stepSize: 1 } }
          }
        }
      });
    },

    printReport() {
      window.print();
    },

    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
};