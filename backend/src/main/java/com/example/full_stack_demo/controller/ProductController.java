package com.example.full_stack_demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class ProductController {

    @GetMapping("/")
    public String home() {
        return "Spring Boot Application is Working!";
    }

    @GetMapping("/api/hello")
    public String hello() {
        return "Hello! Spring Boot REST API is Working Successfully!";
    }
}