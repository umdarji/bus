// Bus Management System JavaScript

// Sample data for buses
const sampleBuses = [
    {
        id: 1,
        busNumber: "BUS001",
        from: "New York",
        to: "Los Angeles",
        departureTime: "08:00",
        arrivalTime: "20:00",
        date: "2024-01-15",
        price: 120,
        capacity: 50,
        availableSeats: 35,
        status: "running"
    },
    {
        id: 2,
        busNumber: "BUS002",
        from: "Chicago",
        to: "Houston",
        departureTime: "10:30",
        arrivalTime: "18:30",
        date: "2024-01-15",
        price: 85,
        capacity: 45,
        availableSeats: 20,
        status: "running"
    },
    {
        id: 3,
        busNumber: "BUS003",
        from: "Los Angeles",
        to: "Phoenix",
        departureTime: "14:00",
        arrivalTime: "19:00",
        date: "2024-01-15",
        price: 65,
        capacity: 40,
        availableSeats: 15,
        status: "scheduled"
    },
    {
        id: 4,
        busNumber: "BUS004",
        from: "Houston",
        to: "New York",
        departureTime: "16:00",
        arrivalTime: "06:00",
        date: "2024-01-15",
        price: 150,
        capacity: 50,
        availableSeats: 0,
        status: "cancelled"
    }
];

// Initialize localStorage with sample data
function initializeData() {
    if (!localStorage.getItem('buses')) {
        localStorage.setItem('buses', JSON.stringify(sampleBuses));
    }
    if (!localStorage.getItem('bookings')) {
        localStorage.setItem('bookings', JSON.stringify([]));
    }
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                role: 'admin',
                name: 'Admin User',
                email: 'admin@busgo.com'
            },
            {
                id: 2,
                username: 'user',
                password: 'user123',
                role: 'user',
                name: 'John Doe',
                email: 'john@example.com'
            }
        ]));
    }
}

// Get data from localStorage
function getBuses() {
    return JSON.parse(localStorage.getItem('buses') || '[]');
}

function getBookings() {
    return JSON.parse(localStorage.getItem('bookings') || '[]');
}

function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Save data to localStorage
function saveBuses(buses) {
    localStorage.setItem('buses', JSON.stringify(buses));
}

function saveBookings(bookings) {
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

// Search buses functionality
function searchBuses(from, to, date, passengers) {
    const buses = getBuses();
    return buses.filter(bus => {
        const matchesRoute = bus.from === from && bus.to === to;
        const matchesDate = bus.date === date;
        const hasEnoughSeats = bus.availableSeats >= parseInt(passengers);
        const isRunning = bus.status === 'running';
        
        return matchesRoute && matchesDate && hasEnoughSeats && isRunning;
    });
}

// Display bus results
function displayBusResults(buses) {
    const resultsContainer = document.getElementById('busResults');
    
    if (!resultsContainer) return;
    
    if (buses.length === 0) {
        resultsContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h3>No buses found</h3>
                <p class="text-muted">Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }
    
    let html = '<h3 class="mb-4">Available Buses</h3>';
    
    buses.forEach(bus => {
        const duration = calculateDuration(bus.departureTime, bus.arrivalTime);
        const statusClass = `status-${bus.status}`;
        
        html += `
            <div class="card bus-card mb-3 fade-in">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="fas fa-bus me-2"></i>${bus.busNumber}
                    </h5>
                    <span class="badge ${statusClass}">${bus.status.toUpperCase()}</span>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="fw-bold">From:</span>
                                <span>${bus.from}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span class="fw-bold">To:</span>
                                <span>${bus.to}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span class="fw-bold">Date:</span>
                                <span>${formatDate(bus.date)}</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="fw-bold">Departure:</span>
                                <span>${bus.departureTime}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span class="fw-bold">Arrival:</span>
                                <span>${bus.arrivalTime}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span class="fw-bold">Duration:</span>
                                <span>${duration}</span>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <div class="d-flex justify-content-between">
                                <span class="fw-bold">Price:</span>
                                <span class="h5 text-primary mb-0">$${bus.price}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span class="fw-bold">Available Seats:</span>
                                <span>${bus.availableSeats}</span>
                            </div>
                        </div>
                        <div class="col-md-6 text-end">
                            <button class="btn btn-primary" onclick="bookTicket(${bus.id})">
                                <i class="fas fa-ticket-alt me-2"></i>Book Ticket
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    resultsContainer.innerHTML = html;
}

// Calculate duration between two times
function calculateDuration(startTime, endTime) {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    
    if (end < start) {
        end.setDate(end.getDate() + 1);
    }
    
    const diff = end - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Book ticket functionality
function bookTicket(busId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        alert('Please login to book a ticket');
        window.location.href = 'login.html';
        return;
    }
    
    // Redirect to booking page with bus ID
    window.location.href = `booking.html?busId=${busId}`;
}

// Handle search form submission
function handleSearchForm() {
    const searchForm = document.getElementById('searchForm');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const from = document.getElementById('from').value;
            const to = document.getElementById('to').value;
            const date = document.getElementById('date').value;
            const passengers = document.getElementById('passengers').value;
            
            if (!from || !to || !date || !passengers) {
                alert('Please fill in all fields');
                return;
            }
            
            if (from === to) {
                alert('Departure and destination cannot be the same');
                return;
            }
            
            const buses = searchBuses(from, to, date, passengers);
            displayBusResults(buses);
            
            // Scroll to results
            document.getElementById('busResults').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// Set minimum date to today
function setMinDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }
}

// Initialize the application
function init() {
    initializeData();
    handleSearchForm();
    setMinDate();
    
    // Display some sample buses on page load
    const sampleResults = searchBuses('New York', 'Los Angeles', '2024-01-15', 1);
    if (sampleResults.length > 0) {
        displayBusResults(sampleResults);
    }
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Export functions for use in other pages
window.busSystem = {
    getBuses,
    getBookings,
    getUsers,
    saveBuses,
    saveBookings,
    saveUsers,
    searchBuses,
    displayBusResults,
    bookTicket,
    calculateDuration,
    formatDate
}; 