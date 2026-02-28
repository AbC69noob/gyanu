package com.digitalattendence.digitalattendencesystem.repository;


import com.digitalattendence.digitalattendencesystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;


import java.util.Optional;
@Repository

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);
    Optional<User> findById(int Id);
    java.util.List<User> findByStatus(boolean status);

}


