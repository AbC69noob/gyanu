package com.example.attendance.models;

public class Program {
    private int id;
    private String name;

    public Program() {}

    public Program(int id) {
        this.id = id;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    @Override
    public String toString() {
        return name;
    }
}
