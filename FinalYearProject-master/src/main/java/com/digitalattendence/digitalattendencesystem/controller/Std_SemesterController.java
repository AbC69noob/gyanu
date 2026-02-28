package com.digitalattendence.digitalattendencesystem.controller;

import com.digitalattendence.digitalattendencesystem.model.Std_Semester;
import com.digitalattendence.digitalattendencesystem.repository.Std_SemesterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student_semester")
public class Std_SemesterController {

    @Autowired
    private Std_SemesterRepository stdSemesterRepository;

    @PostMapping
    public ResponseEntity<Std_Semester> createStdSemester(@RequestBody Std_Semester stdSemester) {
        Std_Semester saved = stdSemesterRepository.save(stdSemester);
        return ResponseEntity.ok(saved);
    }
}


