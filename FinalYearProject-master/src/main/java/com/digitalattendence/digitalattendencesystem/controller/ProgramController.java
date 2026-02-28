package com.digitalattendence.digitalattendencesystem.controller;

import com.digitalattendence.digitalattendencesystem.model.Program;
import com.digitalattendence.digitalattendencesystem.repository.ProgramRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/program")
public class ProgramController {

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private com.digitalattendence.digitalattendencesystem.repository.FacultyRepository facultyRepository;

    @PostMapping
    public ResponseEntity<Program> createProgram(@RequestBody Program program) {
        if (program.getFaculty() != null && program.getFaculty().getId() != null) {
            program.setFaculty(facultyRepository.findById(program.getFaculty().getId()).orElse(null));
        }
        Program savedProgram = programRepository.save(program);
        return ResponseEntity.ok(savedProgram);
    }
    @GetMapping
    public ResponseEntity<List<Program>> getAllPrograms() {
        List<Program> programs = programRepository.findAll();
        return ResponseEntity.ok(programs);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProgram(@PathVariable Long id) {
        if (!programRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("Program not found");
        }

        programRepository.deleteById(id);
        return ResponseEntity.ok("Program deleted successfully");
    }
}

