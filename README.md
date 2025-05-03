# HomeSync

📌 **Project Overview**

The HomeSync is a multi-user platform built with Flask, Vue.js, and SQLite, designed to facilitate comprehensive home servicing and solutions. It features three roles: Admin, Service Professional, and Customer, each with distinct functionalities. The application includes service management, request handling, user management, and backend job processing for enhanced performance and user experience.

🚀 **Features**

* **Role-Based Access Control (RBAC):**
  * **Admin:** User and service management, professional approval, fraud prevention.
  * **Service Professional:** Request acceptance/rejection, profile management, service completion.
  * **Customer:** Service request creation, search, review, and closure.
* **Service Management:** Create, update, and delete services with base prices.
* **Service Request Handling:** Create, edit, and close service requests.
* **User Management:** User monitoring, blocking/unblocking, and profile management.
* **Search Functionality:** Service search by name/location, professional search by admin.
* **Backend Jobs:**
  * Daily reminders to service professionals.
  * Monthly activity reports for customers.
  * User-triggered CSV export of service requests.
* **Performance and Caching:** Redis caching for optimized performance.
* **Responsive UI:** Built with Vue.js and Bootstrap.
* **Authentication:** Secure login and registration.

🛠️ **Tech Stack**

* **Backend:** Flask (Python), SQLite (Database), Redis (Caching), Celery (Background Jobs)
* **Frontend:** Vue.js, Bootstrap (HTML/CSS)

🔧 **Installation & Setup**

1. **Clone the repository:**

    ```bash
    git clone [repository_url]
    cd [project_directory]
    ```

2. **Create a virtual environment & install dependencies:**

    * Open the terminal.
    * Navigate to the project directory.
    * Create a virtual environment: `python -m venv .env`
    * Activate the virtual environment 
        * On Windows: `.env\Scripts\activate`
    * Install backend dependencies: `pip install -r requirements.txt`

3. **Database setup:**

    * SQLite database will be created automatically.

4. **Redis setup:**

    * Ensure Redis is installed and running.

5. **Celery setup:**

    * Ensure Redis is running (Celery broker).
    * Run the Celery worker: `celery -A backend.tasks.celery worker --loglevel=info` (Adjust `backend.tasks` if needed)

6. **Flask API setup:**

    * Run the Flask application: `python app.py`

7. **Vue.js setup:**

    * Navigate to the frontend directory: `cd ../frontend`
    * Run the Vue.js development server: `npm run dev`

🔑 **User Roles & Authentication**

* **Admin:**
  * Login (no registration required).
  * Manage users and services.
* **Service Professional:**
  * Register and log in.
  * Manage service requests.
* **Customer:**
  * Register and log in.
  * Create and manage service requests.

📌 **API Endpoints**
