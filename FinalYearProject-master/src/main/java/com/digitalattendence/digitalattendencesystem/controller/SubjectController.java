package com.digitalattendence.digitalattendencesystem.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.digitalattendence.digitalattendencesystem.model.Subject;
import com.digitalattendence.digitalattendencesystem.repository.SubjectRepository;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/subjects")
public class SubjectController {

    private final SubjectRepository subjectRepository;

    public SubjectController(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    // CREATE new subject
    @PostMapping
    public Subject save(@RequestBody Subject subject) {
        return subjectRepository.save(subject);
    }

    // GET all subjects
    @GetMapping
    public List<Subject> getAll() {
        return subjectRepository.findAll();
    }

    // UPDATE subject by ID
    @PutMapping("/{id}")
    public ResponseEntity<Subject> updateSubject(
            @PathVariable Long id,
            @RequestBody Subject subjectDetails) {

        return subjectRepository.findById(id).map(subject -> {
            subject.setName(subjectDetails.getName());   // Update name
            subject.setCode(subjectDetails.getCode());   // Update code
            subject.setProgram(subjectDetails.getProgram()); // Update program
            subject.setSemester(subjectDetails.getSemester()); // Update semester
            subject.setTeacher(subjectDetails.getTeacher()); // Update teacher

            Subject updated = subjectRepository.save(subject);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

}