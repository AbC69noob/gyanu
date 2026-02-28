package com.digitalattendence.digitalattendencesystem.repository;


import com.digitalattendence.digitalattendencesystem.model.CourseAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseAllocationRepository extends JpaRepository<CourseAllocation, Long> {
    // No extra code needed; Spring provides save(), findAll(), findById(), deleteById(), etc.
}

