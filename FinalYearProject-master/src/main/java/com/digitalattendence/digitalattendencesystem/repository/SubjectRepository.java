package com.digitalattendence.digitalattendencesystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.digitalattendence.digitalattendencesystem.model.Subject;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Subject findByName(String name);
}
