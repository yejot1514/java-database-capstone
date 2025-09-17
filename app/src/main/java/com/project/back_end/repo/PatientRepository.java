package com.project.back_end.repo;

import com.project.back_end.models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    // 1. Extend JpaRepository:
//    - The repository extends JpaRepository<Patient, Long>, which provides basic CRUD functionality.
//    - This allows the repository to perform operations like save, delete, update, and find without needing to implement these methods manually.
//    - JpaRepository also includes features like pagination and sorting.

// Example: public interface PatientRepository extends JpaRepository<Patient, Long> {}

// 2. Custom Query Methods:

//    - **findByEmail**:
//      - This method retrieves a Patient by their email address.
//      - Return type: Patient
//      - Parameters: String email

//    - **findByEmailOrPhone**:
//      - This method retrieves a Patient by either their email or phone number, allowing flexibility for the search.
//      - Return type: Patient
//      - Parameters: String email, String phone

// 3. @Repository annotation:
//    - The @Repository annotation marks this interface as a Spring Data JPA repository.
//    - Spring Data JPA automatically implements this repository, providing the necessary CRUD functionality and custom queries defined in the interface.
      Patient findByEmail(String email);

    Patient findByEmailOrPhone(String email, String phone);

}

