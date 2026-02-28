package com.digitalattendence.digitalattendencesystem.repository;


import com.digitalattendence.digitalattendencesystem.model.Std_Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Std_SemesterRepository extends JpaRepository<Std_Semester, Long> {
    // Spring provides findAll(), save(), findById(), deleteById(), etc.
}


