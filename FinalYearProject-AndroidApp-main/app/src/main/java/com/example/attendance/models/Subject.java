package com.example.attendance.models;

public class Subject {
    private int id;
    private String name;
    private String code;
    private Program program;
    private Semester semester;
    private Teacher teacher;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public Program getProgram() { return program; }
    public void setProgram(Program program) { this.program = program; }
    public Semester getSemester() { return semester; }
    public void setSemester(Semester semester) { this.semester = semester; }
    public Teacher getTeacher() { return teacher; }
    public void setTeacher(Teacher teacher) { this.teacher = teacher; }

    @Override
    public String toString() {
        return name + " (" + code + ")";
    }
}
