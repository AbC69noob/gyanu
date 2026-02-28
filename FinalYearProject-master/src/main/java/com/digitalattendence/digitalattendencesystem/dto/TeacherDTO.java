package com.digitalattendence.digitalattendencesystem.dto;

public class TeacherDTO {


    private String fullName;
    private String contact;
    private String address;
    private Integer status;
    private Long userId;
    private String email;

    // ===== GETTERS =====

    public String getEmail() {
        return email;
    }

        public String getFullName() {
            return fullName;
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

        // ===== SETTERS =====

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }
        
        public void setName(String name) {
            this.fullName = name;
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

    public void setEmail(String email) {
        this.email = email;
    }
}

