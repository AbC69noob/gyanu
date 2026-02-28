package com.digitalattendence.digitalattendencesystem.controller;

import com.digitalattendence.digitalattendencesystem.model.*;
import com.digitalattendence.digitalattendencesystem.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-allocations")
public class CourseAllocationController {

    @Autowired
    private CourseAllocationRepository courseAllocationRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private SemesterRepository semesterRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    // GET all allocations
    @GetMapping
    public List<CourseAllocation> getAll() {
        return courseAllocationRepository.findAll();
    }

    // GET allocation by ID
    @GetMapping("/{id}")
    public ResponseEntity<CourseAllocation> getById(@PathVariable Long id) {
        return courseAllocationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    // CREATE new allocation
    @PostMapping
    public ResponseEntity<?> create(@RequestBody CourseAllocation allocation) {

        if (allocation.getFaculty() == null || allocation.getFaculty().getId() == null)
            return ResponseEntity.badRequest().body("Faculty ID is required");

        if (allocation.getSubject() == null || allocation.getSubject().getId() == null)
            return ResponseEntity.badRequest().body("Subject ID is required");

        if (allocation.getSemester() == null || allocation.getSemester().getId() == null)
            return ResponseEntity.badRequest().body("Semester ID is required");

        if (allocation.getTeacher() == null || allocation.getTeacher().getId() == null)
            return ResponseEntity.badRequest().body("Teacher ID is required");

        Faculty faculty = facultyRepository.findById(allocation.getFaculty().getId())
                .orElseThrow(() -> new RuntimeException("Invalid Faculty ID"));

        Subject subject = subjectRepository.findById(allocation.getSubject().getId())
                .orElseThrow(() -> new RuntimeException("Invalid Subject ID"));

        Semester semester = semesterRepository.findById(allocation.getSemester().getId())
                .orElseThrow(() -> new RuntimeException("Invalid Semester ID"));

        Teacher teacher = teacherRepository.findById(allocation.getTeacher().getId())
                .orElseThrow(() -> new RuntimeException("Invalid Teacher ID"));

        allocation.setFaculty(faculty);
        allocation.setSubject(subject);
        allocation.setSemester(semester);
        allocation.setTeacher(teacher);

        return ResponseEntity.ok(courseAllocationRepository.save(allocation));
    }
    // UPDATE allocation
    @PutMapping("/{id}")
    public ResponseEntity<CourseAllocation> update(@PathVariable Long id, @RequestBody CourseAllocation allocationDetails) {
        return courseAllocationRepository.findById(id).map(allocation -> {

            if (allocationDetails.getFaculty() != null && allocationDetails.getFaculty().getId() != null) {
                allocation.setFaculty(facultyRepository.findById(allocationDetails.getFaculty().getId()).orElse(null));
            }

            if (allocationDetails.getSubject() != null && allocationDetails.getSubject().getId() != null) {
                allocation.setSubject(subjectRepository.findById(allocationDetails.getSubject().getId()).orElse(null));
            }

            if (allocationDetails.getSemester() != null && allocationDetails.getSemester().getId() != null) {
                allocation.setSemester(semesterRepository.findById(allocationDetails.getSemester().getId()).orElse(null));
            }

            if (allocationDetails.getTeacher() != null && allocationDetails.getTeacher().getId() != null) {
                allocation.setTeacher(teacherRepository.findById(allocationDetails.getTeacher().getId()).orElse(null));
            }

            return ResponseEntity.ok(courseAllocationRepository.save(allocation));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE allocation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return courseAllocationRepository.findById(id).map(allocation -> {
            courseAllocationRepository.delete(allocation);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
