
package com.digitalattendence.digitalattendencesystem.model;

import jakarta.persistence.*;


@Entity
@Table(name = "user")
public class  User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Column(unique = true, nullable = false)
    private String email;
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String password;
    private boolean status;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
private String address;
    // ===== GETTERS =====
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public boolean getStatus() {
        return status;
    }

    public Role getRole() {
        return role;
    }
    public String getAddress() {
        return address;
    }


    // ===== SETTERS =====
    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
    public void setAddress(String address) {this.address = address;}
    public void setRole(Role role) {
        this.role = role;
    }
}
