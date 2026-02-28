package com.example.attendance.models;

public class Teacher {
    private int id;
    private String fullName;
    private String email;
    private String contact;
    private int status;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
}
