package com.digitalattendence.digitalattendencesystem.controller;

import com.digitalattendence.digitalattendencesystem.dto.FacultyDTO;
import com.digitalattendence.digitalattendencesystem.model.Faculty;
import com.digitalattendence.digitalattendencesystem.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faculties")
public class FacultyController {

    private final FacultyRepository repo;

    @Autowired
    public FacultyController(FacultyRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Faculty create(@RequestBody FacultyDTO dto) {
        System.out.println("FacultyController: Received request to create faculty: " + (dto != null ? dto.getName() : "null"));
        Faculty faculty = new Faculty();
        faculty.setName(dto.getName());
        return repo.save(faculty);
    }

    @GetMapping
    public List<Faculty> getAll() {
        return repo.findAll();
    }
}