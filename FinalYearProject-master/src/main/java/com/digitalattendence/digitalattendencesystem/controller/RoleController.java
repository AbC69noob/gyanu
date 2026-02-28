package com.digitalattendence.digitalattendencesystem.controller;

import com.digitalattendence.digitalattendencesystem.model.Role;
import com.digitalattendence.digitalattendencesystem.repository.RoleRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
public class RoleController {

    private final RoleRepository repo;

    public RoleController(RoleRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Role> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Role addRole(@RequestBody Role role){
        return repo.save(role);
    }
}
