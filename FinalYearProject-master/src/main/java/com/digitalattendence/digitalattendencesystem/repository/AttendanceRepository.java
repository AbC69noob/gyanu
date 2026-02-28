package com.digitalattendence.digitalattendencesystem.repository;

import com.digitalattendence.digitalattendencesystem.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;



@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
    // Spring automatically provides save(), findAll(), findById(), deleteById(), etc.
}
