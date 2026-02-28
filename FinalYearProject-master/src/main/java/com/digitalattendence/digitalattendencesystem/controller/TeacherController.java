package com.digitalattendence.digitalattendencesystem.controller;

import com.digitalattendence.digitalattendencesystem.dto.TeacherDTO;
import com.digitalattendence.digitalattendencesystem.model.Teacher;
import com.digitalattendence.digitalattendencesystem.model.User;
import com.digitalattendence.digitalattendencesystem.repository.TeacherRepository;
import com.digitalattendence.digitalattendencesystem.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")

public class TeacherController {

    private final TeacherRepository teacherRepo;
    private final UserRepository userRepo;

    public TeacherController(TeacherRepository teacherRepo, UserRepository userRepo) {
        this.teacherRepo = teacherRepo;
        this.userRepo = userRepo;
    }

    // ✅ CREATE TEACHER
    @PostMapping
    public Teacher save(@RequestBody TeacherDTO dto) {

        User user = userRepo.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + dto.getEmail()));

        Teacher teacher = new Teacher();
        teacher.setFullName(dto.getFullName());
        teacher.setContact(dto.getContact());
        teacher.setAddress(user.getAddress());
        teacher.setStatus(dto.getStatus());
        teacher.setUser(user);

        return teacherRepo.save(teacher);
    }
    @GetMapping("/current")
    public ResponseEntity<Teacher> getCurrentTeacher(Principal principal) {

        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        String username = principal.getName();

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Teacher teacher = teacherRepo.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        return ResponseEntity.ok(teacher);
    }
    // ✅ GET ALL TEACHERS
    @GetMapping
    public List<Teacher> getAll() {
        return teacherRepo.findAll();
    }
}
