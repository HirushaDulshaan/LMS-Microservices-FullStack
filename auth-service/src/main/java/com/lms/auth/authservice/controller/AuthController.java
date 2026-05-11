package com.lms.auth.authservice.controller;

import com.lms.auth.authservice.dto.AuthRequest;
import com.lms.auth.authservice.dto.UserDetailResponse;
import com.lms.auth.authservice.dto.UserRegistrationRequest;
import com.lms.auth.authservice.entity.User;
import com.lms.auth.authservice.service.AuthService;
import com.lms.auth.authservice.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")

public class AuthController {

    @Autowired
    private AuthService service;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public String addNewUser(@RequestBody UserRegistrationRequest registrationRequest) {
        // DTO to Entity mapping
        User user = new User();
        user.setFirstName(registrationRequest.getFirstName());
        user.setLastName(registrationRequest.getLastName());
        user.setEmail(registrationRequest.getEmail());
        user.setMobileNumber(registrationRequest.getMobileNumber());
        user.setPassword(registrationRequest.getPassword());
        user.setRole(registrationRequest.getRole());

        return service.saveUser(user);
    }

    @PostMapping("/login")
    public Map<String, String> getToken(@RequestBody AuthRequest authRequest) {
        String token = service.generateToken(authRequest.getEmail(), authRequest.getPassword());
        return Map.of("token", token);
    }

    @GetMapping("/validate")
    public String validateToken(@RequestParam("token") String token) {
        service.validateToken(token);
        return "Token is valid";
    }

    @GetMapping("/user-details")
    public UserDetailResponse getUserDetails(@RequestHeader("Authorization") String authHeader) {
        String token = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else {
            throw new RuntimeException("Invalid Authorization Header");
        }

        String email = jwtService.extractUsername(token);

        User user = service.getUserByEmail(email);

        return new UserDetailResponse(user.getId(), user.getRole().name());
    }
}