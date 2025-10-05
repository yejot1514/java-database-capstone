/*
  Import getAllAppointments to fetch appointments from the backend
  Import createPatientRow to generate a table row for each patient appointment


  Get the table body where patient rows will be added
  Initialize selectedDate with today's date in 'YYYY-MM-DD' format
  Get the saved token from localStorage (used for authenticated API calls)
  Initialize patientName to null (used for filtering by name)


  Add an 'input' event listener to the search bar
  On each keystroke:
    - Trim and check the input value
    - If not empty, use it as the patientName for filtering
    - Else, reset patientName to "null" (as expected by backend)
    - Reload the appointments list with the updated filter


  Add a click listener to the "Today" button
  When clicked:
    - Set selectedDate to today's date
    - Update the date picker UI to match
    - Reload the appointments for today


  Add a change event listener to the date picker
  When the date changes:
    - Update selectedDate with the new value
    - Reload the appointments for that specific date


  Function: loadAppointments
  Purpose: Fetch and display appointments based on selected date and optional patient name

  Step 1: Call getAllAppointments with selectedDate, patientName, and token
  Step 2: Clear the table body content before rendering new rows

  Step 3: If no appointments are returned:
    - Display a message row: "No Appointments found for today."

  Step 4: If appointments exist:
    - Loop through each appointment and construct a 'patient' object with id, name, phone, and email
    - Call createPatientRow to generate a table row for the appointment
    - Append each row to the table body

  Step 5: Catch and handle any errors during fetch:
    - Show a message row: "Error loading appointments. Try again later."


  When the page is fully loaded (DOMContentLoaded):
    - Call renderContent() (assumes it sets up the UI layout)
    - Call loadAppointments() to display today's appointments by default
*/
import { getAllAppointments } from "./services/appointmentRecordService.js";
import { createPatientRow } from "./components/patientRows.js";

//document.addEventListener("DOMContentLoaded", () => {
const tableBody = document.getElementById("patientTableBody");
const token = localStorage.getItem("token");
let selectedDate = new Date().toISOString().split("T")[0]; // today's date in YYYY-MM-DD
let patientName = null;



const searchBar = document.getElementById("searchBar");
if (searchBar) {
  searchBar.addEventListener("input", () => {
    const query = searchBar.value.trim();
    patientName = query !== "" ? query : null;
    loadAppointments();
  });
}


const todayButton = document.getElementById("todayButton");
if (todayButton) {
  todayButton.addEventListener("click", () => {
    selectedDate = new Date().toISOString().split("T")[0];
    document.getElementById("datePicker").value = selectedDate;
    loadAppointments();
  });
}


const datePicker = document.getElementById("datePicker");
if (datePicker) {
  datePicker.addEventListener("change", () => {
    selectedDate = datePicker.value;
    loadAppointments();
  });
}

async function loadAppointments() {
  try {
    const appointments1 = await getAllAppointments(selectedDate, patientName, token);
    //window.alert(typeof appointments1);
    tableBody.innerHTML = "";

    if (!appointments1 || appointments1.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" class="noPatientRecord">No Appointments found for today.</td></tr>`;
      return;
    }
    //if(appointments1.length > 1){ window.alert("length more than one");}
    //const appointment = appointments1.appointments;
    appointments1.forEach(app => { //window.alert("in aptmt loop");
      const patient = {
        id: app.patientId,
        name: app.patientName,
        email: app.patientEmail,
        phone: app.patientPhone
      };
      const row = createPatientRow(patient, app.id, app.doctorId);
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading appointments:", err);
    tableBody.innerHTML = `<tr><td colspan="5" class="noPatientRecord">Error loading appointments. Please try again later.</td></tr>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
    renderContent(); 
    loadAppointments(); 
  });

loadAppointments();

