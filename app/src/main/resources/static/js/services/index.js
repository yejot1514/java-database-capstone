/*
  Import the openModal function to handle showing login popups/modals
  Import the base API URL from the config file
  Define constants for the admin and doctor login API endpoints using the base URL

  Use the window.onload event to ensure DOM elements are available after page load
  Inside this function:
    - Select the "adminLogin" and "doctorLogin" buttons using getElementById
    - If the admin login button exists:
        - Add a click event listener that calls openModal('adminLogin') to show the admin login modal
    - If the doctor login button exists:
        - Add a click event listener that calls openModal('doctorLogin') to show the doctor login modal


  Define a function named adminLoginHandler on the global window object
  This function will be triggered when the admin submits their login credentials

  Step 1: Get the entered username and password from the input fields
  Step 2: Create an admin object with these credentials

  Step 3: Use fetch() to send a POST request to the ADMIN_API endpoint
    - Set method to POST
    - Add headers with 'Content-Type: application/json'
    - Convert the admin object to JSON and send in the body

  Step 4: If the response is successful:
    - Parse the JSON response to get the token
    - Store the token in localStorage
    - Call selectRole('admin') to proceed with admin-specific behavior

  Step 5: If login fails or credentials are invalid:
    - Show an alert with an error message

  Step 6: Wrap everything in a try-catch to handle network or server errors
    - Show a generic error message if something goes wrong


  Define a function named doctorLoginHandler on the global window object
  This function will be triggered when a doctor submits their login credentials

  Step 1: Get the entered email and password from the input fields
  Step 2: Create a doctor object with these credentials

  Step 3: Use fetch() to send a POST request to the DOCTOR_API endpoint
    - Include headers and request body similar to admin login

  Step 4: If login is successful:
    - Parse the JSON response to get the token
    - Store the token in localStorage
    - Call selectRole('doctor') to proceed with doctor-specific behavior

  Step 5: If login fails:
    - Show an alert for invalid credentials

  Step 6: Wrap in a try-catch block to handle errors gracefully
    - Log the error to the console
    - Show a generic error message
*/
import { openModal } from '../components/modals.js';
import { API_BASE_URL } from '../config/config.js';
//import { createDoctorCard } from '../components/doctorCard.js';
//import { filterDoctors } from './doctorServices.js';//call the same function to avoid duplication coz the functionality was same
import { patientSignup, patientLogin } from './patientServices.js';

//const ADMIN_API = `${BASE_API_URL}/admin/login`;
const ADMIN_API = API_BASE_URL + '/admin/login';
//const DOCTOR_API = `${BASE_API_URL}/doctor/login`;
const DOCTOR_API = API_BASE_URL + '/doctor/login';
//const PATIENT_API = API_BASE_URL + '/patient';

window.onload = function() {
  //alert("jascript started");
  const adminBtn = document.getElementById("adminLoginBtn");
  const doctorBtn = document.getElementById('doctorLoginBtn');
  const patientBtn = document.getElementById('patientBtn');
  

  if (adminBtn) { 
    //alert("admin button clicked");
    adminLoginBtn.addEventListener('click', () => openModal('adminLogin'));
  }

  if (doctorBtn) {
    doctorBtn.addEventListener('click', () => openModal('doctorLogin'));
  }
  if (patientBtn){
    //patientBtn.addEventListener('click', () => openModal('patientLogin'));
    patientBtn.addEventListener('click', () => dan);
  }
  
  const patientSignUpBtn = document.getElementById('patientSignUpBtn');

  if (patientSignUpBtn){
   // patientBtn.addEventListener('click', () => openModal('patientSignUp2'));
  }
};
window.dan= function(){
    //openModal("patientSignup2");
    selectRole("patient");
}
//
window.adminLoginHandler = async function () {
    const username = document.getElementById("adminUsername").value;
    //alert("you entered " + username);
    const password = document.getElementById("adminPassword").value;
  
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }
  
    const admin = { username, password };
  
    try {
        alert(ADMIN_API);
      const response = await fetch(ADMIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(admin)
      });
  
      if (!response.ok) {
        //alert.()
        alert("Invalid credentials!");
        return;
      }
  
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", "admin");
  
      selectRole("admin");
    } catch (error) {
      console.error("Admin login failed:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  //
window.doctorLoginHandler = async function () {
    const identifier = document.getElementById("doctorEmail").value;
    const password = document.getElementById("doctorPassword").value;
  
    if (!identifier || !password) {
      alert("Please enter both email and password.");
      return;
    }
  
    const doctor = { identifier, password };
  
    try {
      const response = await fetch(DOCTOR_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(doctor)
      });
      if (!response.ok) {
        alert("Invalid credentials!");
        return;
      }
  
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", "doctor");
  
      selectRole("doctor");
    } catch (error) {
      console.error("Doctor login failed:", error);
      alert("An error occurred. Please try again later.");
    }
  };


window.patientLoginHandler = async function () {
   
    try {
    const identifier = document.getElementById("patientEmail").value;
    const password = document.getElementById("patientPassword").value;
    
    if (!identifier || !password) {
        alert("Please enter both email and password.");
        return;
      }
    const data = {
      identifier,
      password
    }
    console.log("loginPatient :: ", data)
    const response = await patientLogin(data);
    console.log("Status Code:", response.status);
    console.log("Response OK:", response.ok);
    if (response.ok) {
      const result = await response.json();
      console.log(result);
      selectRole('loggedPatient');
      localStorage.setItem('token', result.token)
      window.location.href = '/pages/loggedPatientDashboard.html';
    } else {
      alert('❌ Invalid credentials!');
    }
  }
  catch (error) {
    alert("❌ Failed to Login : ", error);
    console.log("Error :: loginPatient :: ", error)
  }

  };

window.patientSignupHandler = async function() {
    try {
    const name = document.getElementById("patientNames").value;
    const email = document.getElementById("patientEmails").value;
    const password = document.getElementById("patientPasswords").value;
    const phone = document.getElementById("patientPhone").value;
    const address = document.getElementById("patientAddress").value;
    
    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    //const newPatient = { identifier, password };
    const data = { name, email, password, phone, address };
    const { success, message } = await patientSignup(data);
    if (success) {
      alert(message);
      document.getElementById("modal").style.display = "none";
      window.location.reload();
    }
    else alert(message);
    
  } catch (error) {
    console.error("Signup failed:", error);
    alert("❌ An error occurred while signing up.");
  }  

};