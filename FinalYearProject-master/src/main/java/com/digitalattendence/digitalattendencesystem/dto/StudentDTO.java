package com.digitalattendence.digitalattendencesystem.dto;

public class StudentDTO {

    private String name;
    private String rollNo;
    private String contact;
    private String address;
    private Integer status;

    private Long userId;          // User.id is Long ✅
    private Long programId;    // FIXED ✅
    private Long semesterId;   // FIXED ✅
    private Long batchId;

    // ===== GETTERS =====
    public String getName() {
        return name;
    }

    public String getRollNo() {
        return rollNo;
    }

    public String getContact() {
        return contact;
    }

    public String getAddress() {
        return address;
    }

    public Integer getStatus() {
        return status;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getProgramId() {
        return programId;
    }

    public Long getSemesterId() {
        return semesterId;
    }



    // ===== SETTERS =====
    public void setName(String name) {
        this.name = name;
    }

    public void setRollNo(String rollNo) {
        this.rollNo = rollNo;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public void setSemesterId(Long semesterId) {
        this.semesterId = semesterId;
    }

    public Long getBatchId() {
        return batchId;
    }

    public void setBatchId(Long batchId) {
        this.batchId = batchId;
    }
}
