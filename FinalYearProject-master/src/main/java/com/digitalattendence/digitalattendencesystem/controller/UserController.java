package com.digitalattendence.digitalattendencesystem.controller;

import com.digitalattendence.digitalattendencesystem.dto.UserDTO;
import com.digitalattendence.digitalattendencesystem.model.Role;
import com.digitalattendence.digitalattendencesystem.model.User;
import com.digitalattendence.digitalattendencesystem.repository.RoleRepository;
import com.digitalattendence.digitalattendencesystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository repo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserController(UserRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/test")
    public String test() {
        return "OK";
    }


    // ✅ CREATE USER (PASSWORD ENCRYPTED)
    @PostMapping("/register")
    public ResponseEntity<?> save(@RequestBody UserDTO user) {

        System.out.println("===== REGISTER API CALLED =====");
        System.out.println("Payload: Username=" + user.getUsername() + ", Email=" + user.getEmail() + ", Role=" + user.getRole());

        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Role code is required");
        }

        String roleCode = user.getRole().trim().toUpperCase();
        Role role = roleRepo.findByCode(roleCode);

        if (role == null) {
            System.err.println("Error: Role not found for code: " + roleCode);
            return ResponseEntity
                    .badRequest()
                    .body("Invalid role code: " + user.getRole() + ". Role not found in database.");
        }

        if (repo.findByUsername(user.getUsername()).isPresent()) {
             return ResponseEntity.badRequest().body(java.util.Map.of("message", "Username already exists"));
        }

        User newUser = new User();
        newUser.setUsername(user.getUsername());
        newUser.setEmail(user.getEmail());
        newUser.setRole(role);
        newUser.setStatus(true);
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setAddress(user.getAddress());

        User savedUser = repo.save(newUser);
        System.out.println("User registered successfully: " + savedUser.getId());
        
        return ResponseEntity.ok(savedUser);
    }

    // ✅ UPDATE USER (SAFE PASSWORD UPDATE)
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User userDetails) {

        User user = repo.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        user.setUsername(userDetails.getUsername());
        user.setEmail(userDetails.getEmail());
        user.setRole(userDetails.getRole());
        user.setStatus(userDetails.getStatus());

        // 🔐 Encrypt only if password is updated
        if (userDetails.getPassword() != null &&
                !userDetails.getPassword().isBlank()) {

//            user.setPassword(
//                    passwordEncoder.encode(userDetails.getPassword())
//            );
        }

        return ResponseEntity.ok(repo.save(user));
    }
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = repo.findByStatus(true);
        return ResponseEntity.ok(users);
    }
    // ✅ SOFT DELETE USER (SET STATUS TO INACTIVE)
    @DeleteMapping("/{id}")
    public ResponseEntity<User> softDeleteUser(@PathVariable Long id) {
        // Find user by ID
        User user = repo.findById(id).orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Set status to inactive (0)
        user.setStatus(false); // assuming status is boolean; if int, use 0

        // Save the updated user
        User updatedUser = repo.save(user);

        return ResponseEntity.ok(updatedUser);
    }

}
