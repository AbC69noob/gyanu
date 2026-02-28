package com.digitalattendence.digitalattendencesystem.repository;

import com.digitalattendence.digitalattendencesystem.model.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Faculty findByName(String name);
}


