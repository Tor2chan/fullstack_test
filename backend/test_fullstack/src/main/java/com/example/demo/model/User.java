package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String name;
    private String email;
    private String role;
    private String password;

    // Getters and Setters

    public User() {
        this.role = "user";  // กำหนดค่า default เป็น "USER"
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() {return username; }
    public void setUsername(String username){ this.username = username; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole(){ return role; }
    public void setRole(String role ){ this.role = role; }

    public String getPassword() { return password; }
    public void setPassword(String password){ this.password = password; }
}
