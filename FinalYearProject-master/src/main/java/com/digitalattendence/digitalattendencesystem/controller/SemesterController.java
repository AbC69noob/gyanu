package com.digitalattendence.digitalattendencesystem.controller;
import com.digitalattendence.digitalattendencesystem.model.Semester;
import com.digitalattendence.digitalattendencesystem.repository.SemesterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/semester")
public class SemesterController {

    @Autowired
    private SemesterRepository semesterRepository;

    // ✅ CREATE
    @PostMapping
    public ResponseEntity<Semester> createSemester(@RequestBody Semester semester) {
        return ResponseEntity.ok(semesterRepository.save(semester));
    }

    // ✅ GET ALL
    @GetMapping
    public ResponseEntity<List<Semester>> getAllSemesters() {
        return ResponseEntity.ok(semesterRepository.findAll());
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Semester> getSemesterById(@PathVariable Long id) {   // ✅ Long
        return semesterRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Semester> updateSemester(
            @PathVariable Long id,   // ✅ Long
            @RequestBody Semester updatedSemester) {

        return semesterRepository.findById(id).map(semester -> {
            semester.setNumber(updatedSemester.getNumber());
            return ResponseEntity.ok(semesterRepository.save(semester));
        }).orElse(ResponseEntity.notFound().build());
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSemester(@PathVariable Long id) {   // ✅ Long
        if (!semesterRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        semesterRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
