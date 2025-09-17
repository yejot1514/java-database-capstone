package com.project.back_end.repo;

import com.project.back_end.models.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    // 1. Extend JpaRepository:
//    - The repository extends JpaRepository<Admin, Long>, which gives it basic CRUD functionality.
//    - The methods such as save, delete, update, and find are inherited without the need for explicit implementation.
//    - JpaRepository also includes pagination and sorting features.

// Example: public interface AdminRepository extends JpaRepository<Admin, Long> {}

// 2. Custom Query Method:
//    - **findByUsername**:
//      - This method allows you to find an Admin by their username.
//      - Return type: Admin
//      - Parameter: String username
//      - It will return an Admin entity that matches the provided username.
//      - If no Admin is found with the given username, it returns null.

// Example: public Admin findByUsername(String username);

// 3. Add @Repository annotation:
//    - The @Repository annotation marks this interface as a Spring Data JPA repository.
//    - While it is technically optional (since JpaRepository is a part of Spring Data), it's good practice to include it for clarity.
//    - Spring Data JPA automatically implements the repository, providing the necessary CRUD functionality.

// Example: @Repository
//          public interface AdminRepository extends JpaRepository<Admin, Long> { ... }

//public interface AdminRepository extends JpaRepository<Admin, Long> {

    // 2. Custom method to find admin by username
    Admin findByUsername(String username);

}
