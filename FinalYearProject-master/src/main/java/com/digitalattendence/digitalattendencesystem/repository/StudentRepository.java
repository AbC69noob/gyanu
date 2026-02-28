package com.digitalattendence.digitalattendencesystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.digitalattendence.digitalattendencesystem.model.Student;

import java.util.List;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByProgramIdAndSemesterId(Long programId, Long semesterId);
    Optional<Student> findByUserId(Long userId);
}

