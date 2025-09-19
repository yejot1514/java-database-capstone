package com.project.back_end.services;

import com.project.back_end.models.Appointment;

import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;

import jakarta.transaction.Transactional;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;

@Service 
public class AppointmentService {
// 1. **Add @Service Annotation**:
//    - To indicate that this class is a service layer class for handling business logic.
//    - The `@Service` annotation should be added before the class declaration to mark it as a Spring service component.
//    - Instruction: Add `@Service` above the class definition.

// 2. **Constructor Injection for Dependencies**:
//    - The `AppointmentService` class requires several dependencies like `AppointmentRepository`, `Service`, `TokenService`, `PatientRepository`, and `DoctorRepository`.
//    - These dependencies should be injected through the constructor.
//    - Instruction: Ensure constructor injection is used for proper dependency management in Spring.

// 3. **Add @Transactional Annotation for Methods that Modify Database**:
//    - The methods that modify or update the database should be annotated with `@Transactional` to ensure atomicity and consistency of the operations.
//    - Instruction: Add the `@Transactional` annotation above methods that interact with the database, especially those modifying data.

// 4. **Book Appointment Method**:
//    - Responsible for saving the new appointment to the database.
//    - If the save operation fails, it returns `0`; otherwise, it returns `1`.
//    - Instruction: Ensure that the method handles any exceptions and returns an appropriate result code.

// 5. **Update Appointment Method**:
//    - This method is used to update an existing appointment based on its ID.
//    - It validates whether the patient ID matches, checks if the appointment is available for updating, and ensures that the doctor is available at the specified time.
//    - If the update is successful, it saves the appointment; otherwise, it returns an appropriate error message.
//    - Instruction: Ensure proper validation and error handling is included for appointment updates.

// 6. **Cancel Appointment Method**:
//    - This method cancels an appointment by deleting it from the database.
//    - It ensures the patient who owns the appointment is trying to cancel it and handles possible errors.
//    - Instruction: Make sure that the method checks for the patient ID match before deleting the appointment.

// 7. **Get Appointments Method**:
//    - This method retrieves a list of appointments for a specific doctor on a particular day, optionally filtered by the patient's name.
//    - It uses `@Transactional` to ensure that database operations are consistent and handled in a single transaction.
//    - Instruction: Ensure the correct use of transaction boundaries, especially when querying the database for appointments.

// 8. **Change Status Method**:
//    - This method updates the status of an appointment by changing its value in the database.
//    - It should be annotated with `@Transactional` to ensure the operation is executed in a single transaction.
//    - Instruction: Add `@Transactional` before this method to ensure atomicity when updating appointment status.
    private final AppointmentRepository appointmentRepository;
    private final AppService service;
    private final TokenService tokenService;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            AppService service,
            TokenService tokenService,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.service = service;
        this.tokenService = tokenService;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }
    
    
     public int bookAppointment(Appointment appointment) {
        try {
            appointmentRepository.save(appointment);
            return 1;
        } catch (Exception e) {
            System.err.println("Error booking appointment: " + e.getMessage());
            return 0;
        }
    }

    public ResponseEntity<Map<String, String>> updateAppointment(
            Appointment appointment
    ) {
        Map<String, String> response = new HashMap<>();

        Optional<Appointment> existingAppointment = appointmentRepository.findById(
                appointment.getId()
        );
        if (existingAppointment.isEmpty()) {
            response.put(
                    "message",
                    "Appointment not found with ID: " + appointment.getId()
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        if (
                !existingAppointment
                        .get()
                        .getPatient()
                        .getId()
                        .equals(appointment.getPatient().getId())
        ) {
            response.put("message", "Patient ID mismatch.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        int validationResult = service.validateAppointment(appointment);
        if (validationResult == 1) {
            try {
                appointmentRepository.save(appointment);
                response.put("message", "Appointment updated successfully.");
                return ResponseEntity.status(HttpStatus.OK).body(response);
            } catch (Exception e) {
                System.err.println("Error updating appointment: " + e.getMessage());
                response.put("message", "Internal server error during update.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } else if (validationResult == -1) {
            response.put("message", "Invalid doctor ID.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        response.put(
                "message",
                "Appointment slot unavailable or doctor not available."
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    public ResponseEntity<Map<String, String>> cancelAppointment(
            long id,
            String token
    ) {
        Map<String, String> response = new HashMap<>();
        Optional<Appointment> appointmentOptional = appointmentRepository.findById(
                id
        );

        if (appointmentOptional.isEmpty()) {
            response.put("message", "Appointment not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        String extractedEmail = tokenService.extractEmail(token);
        Patient patient = patientRepository.findByEmail(extractedEmail);

        if (!patient.getId().equals(appointmentOptional.get().getPatient().getId())) {
            response.put("message", "Patient ID mismatch.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        try {
            appointmentRepository.delete(appointmentOptional.get());
            response.put("message", "Appointment cancelled successfully.");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            System.err.println("Error cancelling appointment: " + e.getMessage());
            response.put("message", "Internal server error during cancellation.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @Transactional
    public Map<String, Object> getAppointment(
            String patientName,
            LocalDate date,
            String token
    ) {
        Map<String, Object> map = new HashMap<>();
        String extractedEmail = tokenService.extractEmail(token);
        Long doctorId = doctorRepository.findByEmail(extractedEmail).getId();
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        List<Appointment> appointments;

        if (patientName.equals("null")) {
            appointments =
                    appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(
                            doctorId,
                            startOfDay,
                            endOfDay
                    );
        } else {
            appointments =
                    appointmentRepository.findByDoctorIdAndPatient_NameContainingIgnoreCaseAndAppointmentTimeBetween(
                            doctorId,
                            patientName,
                            startOfDay,
                            endOfDay
                    );
        }

        List<AppointmentDTO> appointmentDTOs = appointments
                .stream()
                .map(
                        app ->
                                new AppointmentDTO(
                                        app.getId(),
                                        app.getDoctor().getId(),
                                        app.getDoctor().getName(),
                                        app.getPatient().getId(),
                                        app.getPatient().getName(),
                                        app.getPatient().getEmail(),
                                        app.getPatient().getPhone(),
                                        app.getPatient().getAddress(),
                                        app.getAppointmentTime(),
                                        app.getStatus()
                                )
                )
                .collect(Collectors.toList());

        map.put("appointments", appointmentDTOs);
        return map;
    }


    @Transactional
    public void changeStatus(long appointmentId) {
        appointmentRepository.updateStatus(1, appointmentId);
    }

}
