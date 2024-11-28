package com.example.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // อนุญาตทุก endpoint
                .allowedOrigins("http://localhost:4200") // อนุญาต origin
                .allowedMethods("GET", "POST", "PUT", "DELETE") // อนุญาต method
                .allowedHeaders("*"); // อนุญาต header
    }
}

