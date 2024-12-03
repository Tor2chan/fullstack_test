package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "sk_users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;
    private String username;
    private String name;
    private String email;
    private String role;
    private String password;
    private String profilePicture;    

    public User() {
        this.role = "user";  
    }

    public String getProfilePicture() {
        return profilePicture;
    }
    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public Long getId() { return user_id; }
    public void setId(Long id) { this.user_id = id; }

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
