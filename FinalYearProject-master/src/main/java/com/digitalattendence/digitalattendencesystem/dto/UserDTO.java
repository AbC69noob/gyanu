package com.digitalattendence.digitalattendencesystem.dto;

public class UserDTO {
    private String username;
    private String email;
    private String password;
    private String role;
    private String address;
    public UserDTO() {
    }

//    {
//        "username":"pooja",
//        "password":"pooja@123",
//        "email":"pooja@gmail.com",
//        "role":"ADM"
//    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
    public String getAddress() {
        return address;
    }

}
