package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import java.util.HashMap;


@RestController
@RequestMapping("/api/tests")
public class TestController {

    @GetMapping
    public Map<String, String> getTest() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Test endpoint works!");
        return response;
    }
}

