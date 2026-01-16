export default {
  template: `
  <div class="w-100 p-0 overflow-hidden font-sans">
    <link rel="stylesheet" href="../static/css/home.css">

    <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-top border-bottom py-3">
      <div class="container">
        <router-link class="navbar-brand d-flex align-items-center gap-2" to="/">
          <i class="bi bi-house-heart-fill text-dark fs-4"></i>
          <span class="fw-bold fs-4 tracking-tight text-dark">HouseSync</span>
        </router-link>

        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNavbar">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-4">
            <li class="nav-item"><a class="nav-link text-secondary" href="#services">Services</a></li>
            <li class="nav-item"><a class="nav-link text-secondary" href="#how-it-works">How it works</a></li>
            <li class="nav-item"><a class="nav-link text-secondary" href="#testimonials">Reviews</a></li>
            <li class="nav-item mt-3 mt-lg-0">
              <router-link to="/login" class="btn btn-outline-dark rounded-pill px-4 btn-sm">
                Log in
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <header class="py-5 mt-5 bg-light">
      <div class="container py-5">
        <div class="row align-items-center gy-5">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold text-dark mb-4 ls-tight">
              Home services, <br>
              <span class="text-secondary">simplified.</span>
            </h1>
            <p class="lead text-secondary mb-5" style="max-width: 480px;">
              Book trusted professionals for cleaning, repairs, and installations. Fast, secure, and hassle-free.
            </p>
            <div class="d-flex flex-wrap gap-3">
              <router-link to="/user_register" class="btn btn-dark rounded-pill px-5 py-3 fw-semibold">
                Book a Service
              </router-link>
              <router-link to="/pro_register" class="btn btn-link text-dark text-decoration-none px-4 py-3 fw-semibold">
                Become a Pro <i class="bi bi-arrow-right ms-1"></i>
              </router-link>
            </div>
            
            <div class="d-flex align-items-center gap-4 mt-5 pt-4 border-top border-secondary-subtle w-75">
              <div>
                <strong class="d-block fs-4 text-dark">4.8</strong>
                <span class="text-muted small">Rating</span>
              </div>
               <div>
                <strong class="d-block fs-4 text-dark">50k+</strong>
                <span class="text-muted small">Bookings</span>
              </div>
            </div>
          </div>
          
          <div class="col-lg-6">
            <img 
              :src="heroImage" 
              alt="Minimal interior" 
              class="img-fluid rounded-4 shadow-sm object-fit-cover w-100" 
              style="min-height: 400px; background-color: #e9ecef;"
            >
          </div>
        </div>
      </div>
    </header>

    <section id="services" class="py-5 bg-white">
      <div class="container py-5">
        <div class="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h2 class="fw-bold mb-1">Our Services</h2>
            <p class="text-secondary mb-0">Essentials for your home.</p>
          </div>
          <a href="#" class="text-dark fw-semibold text-decoration-none d-none d-md-block">View all <i class="bi bi-arrow-right"></i></a>
        </div>

        <div class="row g-4">
          <div v-for="service in services" :key="service.id" class="col-6 col-md-4">
            <div class="card service-card h-100 border-0 bg-light rounded-4 p-3 p-md-4 text-center text-md-start">
              <div class="mb-3 d-inline-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm" style="width: 50px; height: 50px;">
                <i :class="service.icon" class="fs-4 text-dark"></i>
              </div>
              <h5 class="fw-bold mb-2">{{ service.name }}</h5>
              <p class="text-secondary small mb-0 d-none d-md-block">{{ service.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="py-5 bg-light">
      <div class="container py-5 text-center">
        <h2 class="fw-bold mb-5">How it works</h2>
        <div class="row g-5">
          <div class="col-md-4">
            <div class="p-3">
              <span class="display-6 fw-bold text-black-50 d-block mb-3">01</span>
              <h4 class="fw-bold">Choose</h4>
              <p class="text-secondary">Select your service and tailored requirements.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="p-3">
              <span class="display-6 fw-bold text-black-50 d-block mb-3">02</span>
              <h4 class="fw-bold">Schedule</h4>
              <p class="text-secondary">Pick a time that fits your calendar.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="p-3">
              <span class="display-6 fw-bold text-black-50 d-block mb-3">03</span>
              <h4 class="fw-bold">Relax</h4>
              <p class="text-secondary">We handle the rest with care.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="testimonials" class="py-5 bg-white">
      <div class="container py-5">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div id="testimonialCarousel" class="carousel slide text-center" data-bs-ride="carousel">
              <div class="carousel-inner">
                <div v-for="(testimonial, index) in testimonials" :key="testimonial.id" :class="['carousel-item', { 'active': index === 0 }]">
                  <div class="py-4">
                    <i class="bi bi-quote fs-1 text-black-50"></i>
                    <h3 class="fw-normal lh-base my-4 text-dark">"{{ testimonial.content }}"</h3>
                    <div class="d-flex align-items-center justify-content-center gap-3">
                      <img :src="testimonial.avatar" class="rounded-circle" width="48" height="48" alt="User">
                      <div class="text-start">
                        <h6 class="fw-bold mb-0 text-dark">{{ testimonial.name }}</h6>
                        <small class="text-secondary">{{ testimonial.location }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4">
                <button class="btn btn-light rounded-circle mx-1" data-bs-target="#testimonialCarousel" data-bs-slide="prev"><i class="bi bi-arrow-left"></i></button>
                <button class="btn btn-light rounded-circle mx-1" data-bs-target="#testimonialCarousel" data-bs-slide="next"><i class="bi bi-arrow-right"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="py-5 bg-white border-top">
      <div class="container">
        <div class="row gy-4 justify-content-between">
          <div class="col-md-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <i class="bi bi-house-heart-fill text-dark fs-5"></i>
              <span class="fw-bold fs-5">HouseSync</span>
            </div>
            <p class="text-secondary small">Making home maintenance effortless for everyone.</p>
          </div>
          <div class="col-md-6 text-md-end">
            <div class="d-flex flex-column flex-md-row gap-md-4 gap-2 justify-content-md-end">
              <a href="#" class="text-decoration-none text-secondary small">Privacy Policy</a>
              <a href="#" class="text-decoration-none text-secondary small">Terms of Service</a>
              <a href="#" class="text-decoration-none text-secondary small">Support</a>
            </div>
            <p class="text-muted small mt-3">&copy; 2025 HouseSync. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
  `,
  data() {
    return {
      heroImage: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200",
      services: [
        {
          id: 1,
          name: "Plumbing",
          description: "Leaks, installations, repairs.",
          icon: "bi bi-droplet"
        },
        {
          id: 2,
          name: "Electrical",
          description: "Wiring, power, safety.",
          icon: "bi bi-lightning-charge"
        },
        {
          id: 3,
          name: "Cleaning",
          description: "Deep clean & sanitization.",
          icon: "bi bi-stars"
        },
        {
          id: 4,
          name: "Carpentry",
          description: "Furniture & woodwork.",
          icon: "bi bi-hammer"
        },
        {
          id: 5,
          name: "Painting",
          description: "Interior & exterior freshness.",
          icon: "bi bi-palette"
        },
        {
          id: 6,
          name: "AC Repair",
          description: "Cooling system experts.",
          icon: "bi bi-snow"
        }
      ],
      testimonials: [
        {
          id: 1,
          name: "Priya Sharma",
          location: "Verified Customer, Mumbai",
          content:
            "HouseSync saved me when my kitchen pipe burst. The plumber arrived within 45 minutes and was incredibly professional.",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
          id: 2,
          name: "Arjun Mehta",
          location: "Verified Customer, Bangalore",
          content:
            "Clean interface, reliable professionals, and no hidden charges. Finally, an app that actually works as advertised.",
          avatar: "https://randomuser.me/api/portraits/men/86.jpg"
        },
        {
          id: 3,
          name: "Sneha Kapoor",
          location: "Verified Customer, Delhi NCR",
          content:
            "The deep cleaning service was impeccable. I booked it for Diwali and my apartment looked brand new. Highly recommend!",
          avatar: "https://randomuser.me/api/portraits/women/68.jpg"
        }
      ]
    };
  }

};
