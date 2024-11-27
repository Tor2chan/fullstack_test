package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String storeFile(MultipartFile file, Long userId) throws IOException {
        // ตรวจสอบไฟล์ว่างเปล่า
        if (file.isEmpty()) {
            throw new IOException("Cannot upload empty file");
        }
    
        // ตรวจสอบประเภทไฟล์
        String contentType = file.getContentType();
        if (contentType == null || 
            !contentType.startsWith("image/")) {
            throw new IOException("Only image files are allowed");
        }
    
        // ตรวจสอบขนาดไฟล์ (5MB)
        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            throw new IOException("File size exceeds 5MB");
        }
    
        // สร้าง directory หากยังไม่มี
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);  // สร้างโฟลเดอร์หากไม่มี

        // Generate filename
        String fileName = userId + "_" + System.currentTimeMillis() + "_" + 
                          file.getOriginalFilename().replaceAll("\\s+", "_");
    
        // Copy file to target location
        Path targetLocation = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
    
        return fileName;
    }

    public void deleteFile(String fileName) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(fileName);
        Files.deleteIfExists(filePath);
    }
}
