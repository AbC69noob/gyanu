package com.digitalattendence.digitalattendencesystem.controller;

import com.digitalattendence.digitalattendencesystem.model.Address;
import com.digitalattendence.digitalattendencesystem.repository.AddressRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/addresses")
public class AddressController {

    private final AddressRepository repo;

    public AddressController(AddressRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Address save(@RequestBody Address a) {
        return repo.save(a);
    }

    @GetMapping
    public List<Address> getAll() {
        return repo.findAll();
    }
}
