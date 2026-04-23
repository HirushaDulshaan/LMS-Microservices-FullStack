package com.lms.auth.authservice.controller;

import com.lms.auth.authservice.dto.UserUpdateRequest;
import com.lms.auth.authservice.entity.User;
import com.lms.auth.authservice.service.UserService; // UserService එක import කරන්න
import com.lms.auth.authservice.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService; // Service එක පාවිච්චි කරමු

    @Autowired
    private JwtService jwtService;

    // 1. Profile විස්තර ලබා ගැනීම
    @GetMapping("/profile")
    public User getMyProfile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);

        return userService.getUserByEmail(email); // Service එකෙන් data ගමු
    }

    // 2. Profile එක Update කිරීම
    @PutMapping("/update")
    public User updateProfile(@RequestHeader("Authorization") String authHeader,
                              @RequestBody UserUpdateRequest updateRequest) {

        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);

        // ඔක්කොම Logic ටික Service එකට පාස් කරනවා
        return userService.updateProfile(email, updateRequest);
    }
}