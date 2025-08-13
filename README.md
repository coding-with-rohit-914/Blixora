# Blixora

# Blixora Labs Simulation Portal

![Blixora Labs Logo](https://via.placeholder.com/150x50?text=Blixora+Labs)

A full-stack simulation portal with user authentication, personalized dashboards, and admin management capabilities.

## 🌟 Features

### User Features
- **JWT Authentication**: Secure login/signup system
- **Simulation Catalog**: Browse available simulations with filters
- **Personal Dashboard**: Track enrolled simulations and progress
- **Enrollment System**: Join simulations with progress tracking

### Admin Features
- **CRUD Operations**: Create, read, update, delete simulations
- **User Management**: View all users and their activities
- **Content Management**: Full control over simulation content

## 🛠 Tech Stack

### Frontend
- **HTML5** - Structure
- **CSS3/Bootstrap 5** - Styling and responsive design
- **JavaScript** - Client-side functionality
- **Axios** - HTTP requests

### Backend
- **Django** (v4.0+) - Python web framework
- **Django REST Framework** - API development
- **SimpleJWT** - JSON Web Token authentication

### Database
- **MySQL** - Relational database management

### DevOps
- **Pip** - Python package management
- **Virtualenv** - Python environment isolation

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8+
- MySQL Server
- Node.js (for frontend assets if needed)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/coding-with-rohit-914/Blixora.git
   cd Blixora

Set up virtual environment

bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies

bash
pip install -r requirements.txt
Database setup

Create MySQL database:

sql
CREATE DATABASE blixora_db;
Update settings in blixora/settings.py:

python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'blixora_db',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
Run migrations

bash
python manage.py makemigrations
python manage.py migrate
Create superuser (admin)

bash
python manage.py createsuperuser
Run development server

bash
python manage.py runserver
Access the application

Frontend: http://localhost:8000

Admin panel: http://localhost:8000/admin

🧩 Database Schema
Key Tables
Users: id, username, email, password, role

Simulations: id, title, category, level, duration, description

Enrollments: id, userId, simulationId, status, progress

🌐 API Endpoints
Endpoint	Method	Description
/api/register/	POST	User registration
/api/login/	POST	User login
/api/simulations/	GET	List all simulations
/api/enrollments/	POST	Enroll in simulation
/api/dashboard/	GET	User dashboard data
/api/admin/simulations/	POST	Admin: Create simulation
📚 Documentation
For detailed API documentation, run the development server and visit:
http://localhost:8000/swagger/ (if Swagger is configured)

📜 License
This project is licensed under the MIT License - see the LICENSE.md file for details.

🙏 Acknowledgments
Bharat Intern for the internship opportunity

Django and Bootstrap communities

All open-source contributors

text

This README includes:

1. **Project Overview**: Brief description of what the portal does
2. **Feature Highlights**: Key functionalities for both users and admins
3. **Technology Stack**: Complete list of technologies used
4. **Setup Guide**: Step-by-step installation instructions
5. **Database Schema**: Overview of main tables
6. **API Reference**: Key endpoints with descriptions
7. **Additional Information**: License and acknowledgments

The document is formatted in Markdown with clear section headers and uses emojis for better visual scanning. You can customize the placeholder logo link with your actual project logo when available.
