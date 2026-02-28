package com.example.attendance.models;

public class Student {
    private int id;
    private String name;
    private String rollNo;
    private int status;
    private Program program;
    private Semester semester;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRollNo() { return rollNo; }
    public void setRollNo(String rollNo) { this.rollNo = rollNo; }
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
    public Program getProgram() { return program; }
    public void setProgram(Program program) { this.program = program; }
    public Semester getSemester() { return semester; }
    public void setSemester(Semester semester) { this.semester = semester; }
}
