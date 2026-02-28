package com.digitalattendence.digitalattendencesystem.controller;


import com.digitalattendence.digitalattendencesystem.model.Batch;
import com.digitalattendence.digitalattendencesystem.repository.BatchRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batches")
public class BatchController {

    private final BatchRepository repo;

    public BatchController(BatchRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Batch save(@RequestBody Batch b) {
        return repo.save(b);
    }

    @GetMapping
    public List<Batch> getAll() {
        return repo.findAll();
    }
}

