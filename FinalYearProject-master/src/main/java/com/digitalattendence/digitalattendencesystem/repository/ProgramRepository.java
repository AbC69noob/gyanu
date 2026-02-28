package com.digitalattendence.digitalattendencesystem.repository;

import com.digitalattendence.digitalattendencesystem.model.Program;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgramRepository extends JpaRepository<Program, Long> {
}
