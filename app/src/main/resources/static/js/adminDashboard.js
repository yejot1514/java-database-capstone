/*
  This script handles the admin dashboard functionality for managing doctors:
  - Loads all doctor cards
  - Filters doctors by name, time, or specialty
  - Adds a new doctor via modal form


  Attach a click listener to the "Add Doctor" button
  When clicked, it opens a modal form using openModal('addDoctor')


  When the DOM is fully loaded:
    - Call loadDoctorCards() to fetch and display all doctors


  Function: loadDoctorCards
  Purpose: Fetch all doctors and display them as cards

    Call getDoctors() from the service layer
    Clear the current content area
    For each doctor returned:
    - Create a doctor card using createDoctorCard()
    - Append it to the content div

    Handle any fetch errors by logging them


  Attach 'input' and 'change' event listeners to the search bar and filter dropdowns
  On any input change, call filterDoctorsOnChange()


  Function: filterDoctorsOnChange
  Purpose: Filter doctors based on name, available time, and specialty

    Read values from the search bar and filters
    Normalize empty values to null
    Call filterDoctors(name, time, specialty) from the service

    If doctors are found:
    - Render them using createDoctorCard()
    If no doctors match the filter:
    - Show a message: "No doctors found with the given filters."

    Catch and display any errors with an alert


  Function: renderDoctorCards
  Purpose: A helper function to render a list of doctors passed to it

    Clear the content area
    Loop through the doctors and append each card to the content area


  Function: adminAddDoctor
  Purpose: Collect form data and add a new doctor to the system

    Collect input values from the modal form
    - Includes name, email, phone, password, specialty, and available times

    Retrieve the authentication token from localStorage
    - If no token is found, show an alert and stop execution

    Build a doctor object with the form values

    Call saveDoctor(doctor, token) from the service

    If save is successful:
    - Show a success message
    - Close the modal and reload the page

    If saving fails, show an error message
*/
import { getDoctors, saveDoctor, filterDoctors } from "./services/doctorServices.js";
import { createDoctorCard } from "./components/doctorCard.js";
import { openModal } from "./components/modals.js";
//closeModal
// === Event Listener: Add Doctor Button ===
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addDocBtn");
  if (addBtn) {
    addBtn.addEventListener("click", () => openModal("addDoctor"));
  }
  const addBtn2 = document.getElementById("addDocBtn2");
  if (addBtn2) {
    addBtn2.addEventListener("click", () => openModal("addDoctor"));
  }

  // Load all doctors initially
  loadDoctorCards();

  // Add filter listeners
  document.getElementById("searchBar")?.addEventListener("input", filterDoctorsOnChange);
  document.getElementById("filterTime")?.addEventListener("change", filterDoctorsOnChange);
  document.getElementById("filterSpecialty")?.addEventListener("change", filterDoctorsOnChange);
});

// === Load and Display All Doctor Cards ===
async function loadDoctorCards() {
  try {
    const doctors = await getDoctors();
    renderDoctorCards(doctors);
  } catch (err) {
    console.error("Error loading doctor cards:", err);
  }
}

//
async function filterDoctorsOnChange() {
    const name = document.getElementById('searchDoctor')?.value || null;
    const time = document.getElementById('timeFilter')?.value || null;
    const specialty = document.getElementById('specialtyFilter')?.value || null;
  
    try {
      const result = await filterDoctors(name || 'null', time || 'null', specialty || 'null');
      if (result.doctors && result.doctors.length > 0) {
        renderDoctorCards(result.doctors);
      } else {
        document.getElementById('content').innerHTML = '<p>No doctors found with the given filters.</p>';
      }
    } catch (error) {
      console.error('Error filtering doctors:', error);
      alert('An error occurred while filtering doctors.');
    }
  }


function renderDoctorCards(doctors) {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = "";

  doctors.forEach((doc) => {
    const card = createDoctorCard(doc);
    contentDiv.appendChild(card);
  });
}

window.adminAddDoctor = async () => {
    const name = document.getElementById('doctorName').value;
    const email = document.getElementById('doctorEmail').value;
    const phone = document.getElementById('doctorPhone').value;
    const password = document.getElementById('doctorPassword').value;
    const specialty = document.getElementById('doctorSpecialty').value;
    const availableTimes = document.getElementById('doctorTimes').value.split(',').map(t => t.trim());
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication token not found. Please log in again.');
      return;
    }
  
    const doctor = { name, email, phone, password, specialty, availableTimes };
  
    try {
      const result = await saveDoctor(doctor, token);
      if (result.success) {
        alert('Doctor added successfully!');
        document.getElementById('addDoctorModal').style.display = 'none';
        loadDoctorCards();
      } else {
        alert(`Failed to add doctor: ${result.message}`);
      }
    } catch (error) {
      console.error('Error adding doctor:', error);
      alert('An error occurred while adding the doctor.');
    }
  };