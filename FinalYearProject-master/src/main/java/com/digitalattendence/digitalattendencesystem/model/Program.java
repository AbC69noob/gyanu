package com.digitalattendence.digitalattendencesystem.model;


import jakarta.persistence.*;

@Entity
@Table(name = "program")
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;   // ✅ MUST BE LONG

    private String name;
    
    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    public Program() {}

    public Long getId() {   // ✅ RETURN LONG
        return id;
    }

    public void setId(Long id) {   // ✅ ACCEPT LONG
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Faculty getFaculty() {
        return faculty;
    }

    public void setFaculty(Faculty faculty) {
        this.faculty = faculty;
    }
}

