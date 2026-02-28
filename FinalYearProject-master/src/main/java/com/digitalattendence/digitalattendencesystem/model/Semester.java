package com.digitalattendence.digitalattendencesystem.model;
import jakarta.persistence.*;

@Entity
@Table(name = "semester")
public class Semester {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;   // ✅ MUST be Long

    private Integer number;   // Semester number (1, 2, 3...)

    // ===== Constructors =====
    public Semester() {}

    // ===== Getters & Setters =====
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }
}

