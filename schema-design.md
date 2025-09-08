## MySQL Database Design

### Table: admin

-admin_id: INT, Primary Key, Auto Increment<br>
-first_name: VARCHAR, Not Null<br>
-last_name: VARCHAR, Not Null<br>
-password: VARCHAR, Not Null<br>

### Table: patient
-patient_id: INT, Primary Key, Auto Increment<br>
-first_name: VARCHAR, Not Null<br>
-last_name: VARCHAR, Not Null<br>
-password: VARCHAR, Not Null<br>
-dob: DATE, Not Null<br>
-gender: VARCHAR, Not Null<br>
-address: VARCHAR, Not Null<br>
-phone: VARCHAR<br>
-insurance_info: TEXT<br>

### Table: doctor

-doctor_id: INT, Primary Key, Auto Increment<br>
-first_name: VARCHAR, Not Null<br>
-last_name: VARCHAR, Not Null<br>
-password: VARCHAR, Not Null<br>
-specialization: VARCHAR, Not Null<br>

### Table: appointments

-id: INT, Primary Key, Auto Increment<br>
-doctor_id: INT, Foreign Key → doctors(id)<br>
-patient_id: INT, Foreign Key → patients(id)<br>
-appointment_time: DATETIME, Not Null<br>
-status: INT (0 = Scheduled, 1 = Completed, 2 = Cancelled)<br>

## MangoDB Database Design
### Collection: prescriptions
```json
{
  "_id": "ObjectId('64abc123456')",
  "patientName": "John Smith",
  "appointmentId": 51,
  "medication": "Paracetamol",
  "dosage": "500mg",
  "doctorNotes": "Take 1 tablet every 6 hours.",
  "refillCount": 2,
  "pharmacy": {
    "name": "Walgreens SF",
    "location": "Market Street"
  }
}
```
### Collection: feedback
```json
{
  "_id": "ObjectId",
  "patientId": "ObjectId",
  "doctorId": "ObjectId",       
  "appointmentId": "ObjectId",   
  "rating": 4.5,
  "comment": "Dr. Smith was very attentive.",
  "submittedAt": "2025-09-07T19:52:00Z"
}
```
### Collection: logs
```json
{
  "_id": "ObjectId",
  "timestamp": "2025-09-07T19:52:00Z",
  "level": "INFO",              
  "message": "User logged in",
  "userId": "ObjectId",           
  "context": {
    "ip": "192.168.1.10",
    "endpoint": "/login",
    "method": "POST"
  }
}



