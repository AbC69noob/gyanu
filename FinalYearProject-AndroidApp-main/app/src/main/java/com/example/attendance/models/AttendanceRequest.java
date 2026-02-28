package com.example.attendance.models;

public class AttendanceRequest {
    private String date;
    private String status;
    private int studentId;
    private int subjectId;
    private IdWrapper student;
    private IdWrapper subject;

    public AttendanceRequest(String date, String status, int studentId, int subjectId) {
        this.date = date;
        this.status = status;
        this.studentId = studentId;
        this.subjectId = subjectId;
        this.student = new IdWrapper(studentId);
        this.subject = new IdWrapper(subjectId);
    }

    public static class IdWrapper {
        private int id;
        public IdWrapper(int id) { this.id = id; }
        public int getId() { return id; }
    }

    public String getDate() { return date; }
    public String getStatus() { return status; }
    public IdWrapper getStudent() { return student; }
    public IdWrapper getSubject() { return subject; }
}
