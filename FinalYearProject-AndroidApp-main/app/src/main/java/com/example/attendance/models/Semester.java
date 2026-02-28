package com.example.attendance.models;

public class Semester {
    private int id;
    private int number;

    public Semester() {}

    public Semester(int id) {
        this.id = id;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getNumber() { return number; }
    public void setNumber(int number) { this.number = number; }

    @Override
    public String toString() {
        return "Semester " + number;
    }
}
