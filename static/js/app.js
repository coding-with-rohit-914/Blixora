// DOM Elements
const authButtons = document.getElementById('authButtons');
const userProfile = document.getElementById('userProfile');
const usernameDisplay = document.getElementById('usernameDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const dashboardLink = document.getElementById('dashboardLink');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const simulationsLink = document.getElementById('simulationsLink');
const exploreBtn = document.getElementById('exploreBtn');
const simulationsSection = document.getElementById('simulationsSection');
const dashboardSection = document.getElementById('dashboardSection');
const adminSection = document.getElementById('adminSection');
const simulationsContainer = document.getElementById('simulationsContainer');
const enrollmentsTable = document.getElementById('enrollmentsTable');
const difficultyFilter = document.getElementById('difficultyFilter');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const dashboardUsername = document.getElementById('dashboardUsername');
const dashboardEmail = document.getElementById('dashboardEmail');
const dashboardLogoutBtn = document.getElementById('dashboardLogoutBtn');
const adminSimulationsTable = document.getElementById('adminSimulationsTable');
const addSimulationBtn = document.getElementById('addSimulationBtn');
const simulationModal = new bootstrap.Modal(document.getElementById('simulationModal'));
const simulationForm = document.getElementById('simulationForm');
const saveSimulationBtn = document.getElementById('saveSimulationBtn');
const simulationModalTitle = document.getElementById('simulationModalTitle');

// Global variables
let currentUser = null;
let simulations = [];
let enrollments = [];
let adminSimulations = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    setupEventListeners();
});

// Check if user is authenticated
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
        currentUser = JSON.parse(userData);
        updateUIForAuthenticatedUser();

        // Load appropriate section based on user role
        if (currentUser.role === 'admin') {
            loadAdminPanel();
        } else {
            loadSimulations();
        }
    } else {
        updateUIForGuestUser();
        showHomeSection();
    }
}

// Update UI for authenticated user
function updateUIForAuthenticatedUser() {
    authButtons.classList.add('d-none');
    userProfile.classList.remove('d-none');
    usernameDisplay.textContent = currentUser.username;

    // Show admin link if user is admin
    if (currentUser.role === 'admin') {
        dashboardLink.textContent = 'Admin Panel';
    }
}

// Update UI for guest user
function updateUIForGuestUser() {
    authButtons.classList.remove('d-none');
    userProfile.classList.add('d-none');
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    logoutBtn.addEventListener('click', handleLogout);
    dashboardLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentUser.role === 'admin') {
            loadAdminPanel();
        } else {
            loadDashboard();
        }
    });
    simulationsLink.addEventListener('click', (e) => {
        e.preventDefault();
        loadSimulations();
    });
    exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loadSimulations();
    });

    // Forms
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);

    // Simulations
    difficultyFilter.addEventListener('change', filterSimulations);
    searchBtn.addEventListener('click', searchSimulations);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') searchSimulations();
    });

    // Dashboard
    dashboardLogoutBtn.addEventListener('click', handleLogout);

    // Admin
    addSimulationBtn.addEventListener('click', () => {
        simulationModalTitle.textContent = 'Add Simulation';
        simulationForm.reset();
        document.getElementById('simulationId').value = '';
        simulationModal.show();
    });
    saveSimulationBtn.addEventListener('click', saveSimulation);
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await axios.post('/api/login/', {
            username,
            password
        });

        const { access, refresh, user } = response.data;
        localStorage.setItem('token', access);
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('user', JSON.stringify(user));

        currentUser = user;
        updateUIForAuthenticatedUser();

        // Close the modal
        const loginModalEl = document.getElementById('loginModal');
        const modal = bootstrap.Modal.getInstance(loginModalEl);
        modal.hide();

        // Show appropriate section based on role
        if (user.role === 'admin') {
            loadAdminPanel();
        } else {
            loadSimulations();
        }

        showToast('Login successful!', 'success');
    } catch (error) {
        console.error('Login error:', error);
        showToast('Invalid credentials. Please try again.', 'danger');
    }
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'danger');
        return;
    }

    try {
        const response = await axios.post('/api/register/', {
            username,
            email,
            password,
            role: 'user'
        });

        showToast('Registration successful! Please login.', 'success');

        // Close the modal
        const registerModalEl = document.getElementById('registerModal');
        const modal = bootstrap.Modal.getInstance(registerModalEl);
        modal.hide();

        // Show login modal
        const loginModalEl = document.getElementById('loginModal');
        const loginModal = new bootstrap.Modal(loginModalEl);
        loginModal.show();
    } catch (error) {
        console.error('Registration error:', error);
        showToast('Registration failed. Please try again.', 'danger');
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    currentUser = null;
    updateUIForGuestUser();
    showHomeSection();
    showToast('Logged out successfully.', 'success');
}

// Load simulations
async function loadSimulations() {
    try {
        const token = localStorage.getItem('token');
        let response;

        if (token) {
            response = await axios.get('/api/simulations/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } else {
            response = await axios.get('/api/simulations/');
        }

        simulations = response.data;
        renderSimulations(simulations);
        showSimulationsSection();
    } catch (error) {
        console.error('Error loading simulations:', error);
        showToast('Failed to load simulations.', 'danger');
    }
}

// Render simulations
function renderSimulations(sims) {
    simulationsContainer.innerHTML = '';

    if (sims.length === 0) {
        simulationsContainer.innerHTML = '<div class="col-12 text-center py-5"><h5>No simulations found.</h5></div>';
        return;
    }

    sims.forEach(sim => {
        const isEnrolled = enrollments.some(e => e.simulation.id === sim.id);

        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4';
        card.innerHTML = `
            <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <span class="badge bg-${getLevelBadgeClass(sim.level)}">${sim.level}</span>
                        <small class="text-muted">${sim.duration} min</small>
                    </div>
                    <h5 class="card-title fw-bold">${sim.title}</h5>
                    <p class="card-text text-muted">${sim.description.substring(0, 100)}...</p>
                </div>
                <div class="card-footer bg-white border-0">
                    ${isEnrolled ?
                `<button class="btn btn-outline-primary w-100 enrolled-btn" data-id="${sim.id}">Enrolled</button>` :
                `<button class="btn btn-primary w-100 enroll-btn" data-id="${sim.id}">Enroll Now</button>`}
                </div>
            </div>
        `;

        simulationsContainer.appendChild(card);
    });

    // Add event listeners to enroll buttons
    document.querySelectorAll('.enroll-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (!currentUser) {
                showToast('Please login to enroll in simulations.', 'warning');
                const loginModalEl = document.getElementById('loginModal');
                const modal = new bootstrap.Modal(loginModalEl);
                modal.show();
                return;
            }

            const simId = e.target.getAttribute('data-id');
            await enrollInSimulation(simId);
        });
    });
}

// Filter simulations by difficulty level
function filterSimulations() {
    const level = difficultyFilter.value;
    let filtered = simulations;

    if (level) {
        filtered = simulations.filter(sim => sim.level === level);
    }

    renderSimulations(filtered);
}

// Search simulations
function searchSimulations() {
    const query = searchInput.value.toLowerCase();
    let filtered = simulations;

    if (query) {
        filtered = simulations.filter(sim =>
            sim.title.toLowerCase().includes(query) ||
            sim.description.toLowerCase().includes(query)
        );
    }

    renderSimulations(filtered);
}

// Enroll in a simulation
async function enrollInSimulation(simId) {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.post('/api/enrollments/', {
            simulationId: simId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        showToast('Enrolled successfully!', 'success');
        loadSimulations();
    } catch (error) {
        console.error('Enrollment error:', error);
        showToast('Failed to enroll. Please try again.', 'danger');
    }
}

// Load dashboard
async function loadDashboard() {
    try {
        const token = localStorage.getItem('token');

        const [enrollmentsRes, simulationsRes] = await Promise.all([
            axios.get('/api/dashboard/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
            axios.get('/api/simulations/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        ]);

        enrollments = enrollmentsRes.data;
        simulations = simulationsRes.data;

        renderDashboard();
        showDashboardSection();
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showToast('Failed to load dashboard.', 'danger');
    }
}

// Render dashboard
function renderDashboard() {
    dashboardUsername.textContent = currentUser.username;
    dashboardEmail.textContent = currentUser.email;

    enrollmentsTable.innerHTML = '';

    if (enrollments.length === 0) {
        enrollmentsTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">You haven't enrolled in any simulations yet.</td>
            </tr>
        `;
        return;
    }

    enrollments.forEach(enrollment => {
        const sim = enrollment.simulation;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sim.title}</td>
            <td><span class="badge ${getLevelBadgeClass(sim.level)}">${sim.level}</span></td>
            <td><span class="badge ${getStatusBadgeClass(enrollment.status)}">${enrollment.status}</span></td>
            <td>
                <div class="progress" style="height: 6px;">
                    <div class="progress-bar" role="progressbar" style="width: ${enrollment.progress}%" aria-valuenow="${enrollment.progress}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <small class="text-muted">${enrollment.progress}% complete</small>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary">Continue</button>
            </td>
        `;
        enrollmentsTable.appendChild(row);
    });
}

// Load admin panel
async function loadAdminPanel() {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.get('/api/simulations/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        adminSimulations = response.data;
        renderAdminSimulations();
        showAdminSection();
    } catch (error) {
        console.error('Error loading admin panel:', error);
        showToast('Failed to load admin panel.', 'danger');
    }
}

// Render admin simulations
function renderAdminSimulations() {
    adminSimulationsTable.innerHTML = '';

    if (adminSimulations.length === 0) {
        adminSimulationsTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">No simulations found.</td>
            </tr>
        `;
        return;
    }

    adminSimulations.forEach(sim => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sim.title}</td>
            <td>${sim.category}</td>
            <td><span class="badge ${getLevelBadgeClass(sim.level)}">${sim.level}</span></td>
            <td>${sim.duration} min</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-2 edit-btn" data-id="${sim.id}">Edit</button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${sim.id}">Delete</button>
            </td>
        `;
        adminSimulationsTable.appendChild(row);
    });

    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const simId = e.target.getAttribute('data-id');
            editSimulation(simId);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const simId = e.target.getAttribute('data-id');
            deleteSimulation(simId);
        });
    });
}

// Edit simulation
function editSimulation(simId) {
    const sim = adminSimulations.find(s => s.id == simId);
    if (!sim) return;

    simulationModalTitle.textContent = 'Edit Simulation';
    document.getElementById('simulationId').value = sim.id;
    document.getElementById('title').value = sim.title;
    document.getElementById('category').value = sim.category;
    document.getElementById('level').value = sim.level;
    document.getElementById('duration').value = sim.duration;
    document.getElementById('description').value = sim.description;

    simulationModal.show();
}

// Save simulation (create or update)
async function saveSimulation() {
    const id = document.getElementById('simulationId').value;
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const level = document.getElementById('level').value;
    const duration = document.getElementById('duration').value;
    const description = document.getElementById('description').value;

    if (!title || !category || !level || !duration || !description) {
        showToast('Please fill all fields.', 'warning');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        let response;

        if (id) {
            // Update existing simulation
            response = await axios.put(`/api/admin/simulations/${id}/`, {
                title,
                category,
                level,
                duration,
                description
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            showToast('Simulation updated successfully!', 'success');
        } else {
            // Create new simulation
            response = await axios.post('/api/admin/simulations/', {
                title,
                category,
                level,
                duration,
                description
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            showToast('Simulation created successfully!', 'success');
        }

        simulationModal.hide();
        loadAdminPanel();
    } catch (error) {
        console.error('Error saving simulation:', error);
        showToast('Failed to save simulation.', 'danger');
    }
}

// Delete simulation
async function deleteSimulation(simId) {
    if (!confirm('Are you sure you want to delete this simulation?')) return;

    try {
        const token = localStorage.getItem('token');

        await axios.delete(`/api/admin/simulations/${simId}/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        showToast('Simulation deleted successfully!', 'success');
        loadAdminPanel();
    } catch (error) {
        console.error('Error deleting simulation:', error);
        showToast('Failed to delete simulation.', 'danger');
    }
}

// Helper functions
function getLevelBadgeClass(level) {
    switch (level) {
        case 'beginner': return 'bg-success';
        case 'intermediate': return 'bg-warning text-dark';
        case 'advanced': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'pending': return 'bg-secondary';
        case 'in_progress': return 'bg-primary';
        case 'completed': return 'bg-success';
        default: return 'bg-secondary';
    }
}

function showToast(message, type = 'info') {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '11';

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-${type} border-0 show`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toastEl);
    document.body.appendChild(toastContainer);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toastContainer.remove();
    }, 3000);
}

function showHomeSection() {
    document.querySelector('.hero-section').classList.remove('d-none');
    document.querySelector('section:nth-of-type(2)').classList.remove('d-none');
    document.querySelector('section:nth-of-type(3)').classList.remove('d-none');
    simulationsSection.classList.add('d-none');
    dashboardSection.classList.add('d-none');
    adminSection.classList.add('d-none');
}

function showSimulationsSection() {
    document.querySelector('.hero-section').classList.add('d-none');
    document.querySelector('section:nth-of-type(2)').classList.add('d-none');
    document.querySelector('section:nth-of-type(3)').classList.add('d-none');
    simulationsSection.classList.remove('d-none');
    dashboardSection.classList.add('d-none');
    adminSection.classList.add('d-none');
}

function showDashboardSection() {
    document.querySelector('.hero-section').classList.add('d-none');
    document.querySelector('section:nth-of-type(2)').classList.add('d-none');
    document.querySelector('section:nth-of-type(3)').classList.add('d-none');
    simulationsSection.classList.add('d-none');
    dashboardSection.classList.remove('d-none');
    adminSection.classList.add('d-none');
}

function showAdminSection() {
    document.querySelector('.hero-section').classList.add('d-none');
    document.querySelector('section:nth-of-type(2)').classList.add('d-none');
    document.querySelector('section:nth-of-type(3)').classList.add('d-none');
    simulationsSection.classList.add('d-none');
    dashboardSection.classList.add('d-none');
    adminSection.classList.remove('d-none');
}