package com.example.test_fullstack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.example.demo") 

public class TestFullstackApplication {
    public static void main(String[] args) {
        SpringApplication.run(TestFullstackApplication.class, args);
    }
}


