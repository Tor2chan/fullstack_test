package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.model.RoleUpdate;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.FileStorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200") 
public class UserController {
        
    @Autowired
    private FileStorageService fileStorageService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }   

    @PostMapping
    public User createUser(@RequestBody User user) {
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("user");  
        }
        return userRepository.save(user);
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long userId, @RequestBody RoleUpdate roleUpdate) {
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

            System.out.println("Updating user: " + userId);
            System.out.println("New role: " + roleUpdate.getRole());

            user.setRole(roleUpdate.getRole());
            User updatedUser = userRepository.save(user);
            
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.internalServerError().body("Error updating user role: " + e.getMessage());
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            userRepository.deleteById(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting user: " + e.getMessage());
        }
    }

    // update name
    @PutMapping("/{userId}/name")
    public ResponseEntity<?> updateName(@PathVariable Long userId, @RequestBody Map<String, String> requestBody) {
        try {
            String name = requestBody.get("name");

            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Name cannot be empty");
            }

            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

            user.setName(name);
            User updatedUser = userRepository.save(user);

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error updating user name: " + e.getMessage());
        }
    }

    // update phone
    @PutMapping("/{userId}/phone")
    public ResponseEntity<?> updatePhone(@PathVariable Long userId, @RequestBody Map<String, String> requestBody) {
        try {
            String phone = requestBody.get("phone");

            if (phone == null || phone.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Phone cannot be empty");
            }

            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

            user.setPhone(phone);
            User updatedUser = userRepository.save(user);

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error updating user phone: " + e.getMessage());
        }
    }

    // update B_date
    @PutMapping("/{userId}/b_date")
    public ResponseEntity<?> updateB_date(@PathVariable Long userId, @RequestBody Map<String, String> requestBody) {
        try {
            String b_date = requestBody.get("b_date");

            if (b_date == null || b_date.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("B_date cannot be empty");
            }

            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

            user.setB_date(b_date);
            User updatedUser = userRepository.save(user);

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error updating user b_date: " + e.getMessage());
        }
    }

    // update Gender
    @PutMapping("/{userId}/gender")
    public ResponseEntity<?> updateGender(@PathVariable Long userId, @RequestBody Map<String, String> requestBody) {
        try {
            String gender = requestBody.get("gender");

            if (gender == null || gender.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("B_date cannot be empty");
            }

            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

            user.setGender(gender);
            User updatedUser = userRepository.save(user);

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error updating user gender: " + e.getMessage());
        }
    }

    // update password
    @PutMapping("/{userId}/password")
    public ResponseEntity<?> changePassword(
        @PathVariable Long userId,
        @RequestBody Map<String, String> requestBody) {
        try {
            String currentPassword = requestBody.get("currentPassword");
            String newPassword = requestBody.get("newPassword");
    
            if (currentPassword == null || currentPassword.isEmpty() ||
                newPassword == null || newPassword.isEmpty()) {
                return ResponseEntity.badRequest().body("Both current and new passwords are required.");
            }
    
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    
            // Validate current password
            if (!user.getPassword().equals(currentPassword)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Current password is incorrect.");
            }
    
            // Update password
            user.setPassword(newPassword);
            userRepository.save(user);
    
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password updated successfully.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating password: " + e.getMessage());
        }
    }
    

    // picture
    @PostMapping("/{userId}/profile-picture")
    public ResponseEntity<?> uploadProfilePicture(
        @PathVariable Long userId, 
        @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }
    
            // check type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed");
            }
    
            // storage
            String fileName = fileStorageService.storeFile(file, userId);
    
            // update user
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            user.setProfilePicture(fileName);
            userRepository.save(user);
    
            Map<String, String> response = new HashMap<>();
            response.put("fileName", fileName);
            response.put("message", "Profile picture uploaded successfully");
    
            return ResponseEntity.ok(response);
    
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading profile picture: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}/profile-picture")
    public ResponseEntity<?> getProfilePictureUrl(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Map<String, String> response = new HashMap<>();
        response.put("profilePicture", user.getProfilePicture());
        return ResponseEntity.ok(response);
    }
}


