
export default {
  template: `
  <div class="w-100 container-fluid p-0">
    <link rel="stylesheet" href="../static/css/home.css">
    <link rel="stylesheet" href="../static/css/nav.css">
    <nav class="navbar navbar-expand-lg navbar-dark nav-color fixed-top">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <i class="bi bi-house-heart-fill me-2 fs-4"></i>
          <span class="fw-bold fs-4" style="letter-spacing: 0.5px;">HouseSync</span>
        </router-link>
        <div class="ms-auto">
          <router-link to="/login" class="btn btn-outline-light px-4 rounded-pill">
            <i class="bi bi-box-arrow-in-right me-2"></i>
            <span class="d-none d-sm-inline">Login</span>
          </router-link>
        </div>
      </div>
    </nav>

    <header class="hero-section text-white text-center">
      <div class="container">
        <div class="row align-items-center">
          <div class="col">
            <h1 class="display-4 fw-bold mb-4">Home Services Made Simple</h1>
            <p class="lead mb-4">Book trusted professionals for all your home needs in just a few clicks.</p>
            <div class="d-flex justify-content-center align-items-center">
              <router-link to="/user_register" class="btn btn-success btn-lg px-4">Get Started </router-link>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section class="stats-bar py-4 bg-light">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-3">
            <h3 class="fw-bold text-primary">500+</h3>
            <p class="mb-0">Happy Customers</p>
          </div>
          <div class="col-md-3">
            <h3 class="fw-bold text-primary">50+</h3>
            <p class="mb-0">Verified Professionals</p>
          </div>
          <div class="col-md-3">
            <h3 class="fw-bold text-primary">24/7</h3>
            <p class="mb-0">Customer Support</p>
          </div>
          <div class="col-md-3">
            <h3 class="fw-bold text-primary">100%</h3>
            <p class="mb-0">Satisfaction Guarantee</p>
          </div>
        </div>
      </div>
    </section>

    <section id="services" class="py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold">Our Services</h2>
          <p class="text-muted">Quality home services at your convenience</p>
        </div>
        <div class="row g-4">
          <div v-for="service in services" :key="service.id" class="col-md-4">
            <div class="card service-card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="service-icon rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                  <i :class="service.icon" class="fs-3 text-primary"></i>
                </div>
                <h4 class="card-title">{{ service.name }}</h4>
                <p class="card-text text-muted">{{ service.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="py-5 bg-light">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold">How It Works</h2>
          <p class="text-muted">Get your home services in 3 easy steps</p>
        </div>
        <div class="row g-4">
          <div class="col-md-4">
            <div class="step-card text-center p-4 bg-white rounded h-100">
              <div class="step-number rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-white fw-bold fs-5">1</div>
              <h4>Choose Your Service</h4>
              <p class="text-muted">Select from our wide range of professional home services</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="step-card text-center p-4 bg-white rounded h-100">
              <div class="step-number rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-white fw-bold fs-5">2</div>
              <h4>Book an Appointment</h4>
              <p class="text-muted">Pick a date and time that works best for you</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="step-card text-center p-4 bg-white rounded h-100">
              <div class="step-number rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 text-white fw-bold fs-5">3</div>
              <h4>Enjoy Your Service</h4>
              <p class="text-muted">A verified professional will arrive at your scheduled time</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="testimonials" class="py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold">What Our Customers Say</h2>
          <p class="text-muted">Trusted by homeowners across the city</p>
        </div>
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div id="testimonialCarousel" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner">
                <div v-for="(testimonial, index) in testimonials" :key="testimonial.id" 
                     :class="['carousel-item', { 'active': index === 0 }]">
                  <div class="testimonial-item bg-white p-4 rounded shadow-sm">
                    <p class="fst-italic">"{{ testimonial.content }}"</p>
                    <div class="testimonial-author d-flex align-items-center mt-4">
                      <img :src="testimonial.avatar" :alt="testimonial.name" class="rounded-circle me-3">
                      <div>
                        <h5 class="mb-1">{{ testimonial.name }}</h5>
                        <p class="text-muted mb-0">{{ testimonial.location }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section py-5 text-white">
      <div class="container text-center">
        <h2 class="mb-4">Ready to Transform Your Home?</h2>
        <p class="lead mb-4">Join thousands of satisfied customers who trust HouseSync for their home service needs.</p>
        <router-link class="btn btn-light btn-lg px-4">Get Started Today</router-link>
      </div>
    </section>

    <footer class="footer py-5 bg-dark text-white">
      <div class="container">
        <div class="row">
          <div class="col-md-6 text-center text-md-start"> 
          <p>Your trusted partner for all home service needs. Quality professionals at your fingertips.</p>
        <p class="mb-0">&copy; 2025 HouseSync. All rights reserved.</p>
          </div>
          <div class="col-md-6 text-center text-md-end">
            <ul class="list-inline mb-0">
              <li class="list-inline-item"><a href="#" class="text-white-50 text-decoration-none">Privacy Policy</a></li>
              <li class="list-inline-item"><a href="#" class="text-white-50 text-decoration-none">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
</div>
`,
  data() {
    return {
      services: [
        {
          id: 1,
          name: "Plumbing",
          description:
            "Expert plumbing solutions for leaks, installations, and repairs.",
          icon: "bi bi-droplet",
        },
        {
          id: 2,
          name: "Electrical",
          description:
            "Certified electricians for all your wiring and power needs.",
          icon: "bi bi-lightning-charge",
        },
        {
          id: 3,
          name: "Cleaning",
          description: "Professional cleaning services for spotless homes.",
          icon: "bi bi-brush",
        },
        {
          id: 4,
          name: "Carpentry",
          description:
            "Custom woodwork and furniture repairs by skilled carpenters.",
          icon: "bi bi-hammer",
        },
        {
          id: 5,
          name: "Painting",
          description: "Interior and exterior painting for a fresh new look.",
          icon: "bi bi-palette",
        },
        {
          id: 6,
          name: "AC Repair",
          description: "Cooling system maintenance and repair services.",
          icon: "bi bi-snow",
        },
      ],
      testimonials: [
        {
          id: 1,
          name: "Sarah Johnson",
          location: "Downtown Resident",
          content:
            "HouseSync saved me when my pipes burst on a weekend. The plumber arrived within an hour and fixed everything professionally.",
          avatar: "https://randomuser.me/api/portraits/women/32.jpg",
        },
        {
          id: 2,
          name: "Michael Chen",
          location: "Suburban Homeowner",
          content:
            "I've used HouseSync for multiple services and each time the professionals have been punctual, skilled, and courteous.",
          avatar: "https://randomuser.me/api/portraits/men/42.jpg",
        },
        {
          id: 3,
          name: "Emily Rodriguez",
          location: "Apartment Dweller",
          content:
            "The cleaning service transformed my apartment before my parents visited. Worth every penny!",
          avatar: "https://randomuser.me/api/portraits/women/63.jpg",
        },
      ],
    };
  },
};
