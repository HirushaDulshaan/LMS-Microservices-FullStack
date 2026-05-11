package com.lms.auth.authservice.controller;

import com.lms.auth.authservice.dto.UserUpdateRequest;
import com.lms.auth.authservice.entity.User;
import com.lms.auth.authservice.enums.Role;
import com.lms.auth.authservice.service.UserService; // UserService එක import කරන්න
import com.lms.auth.authservice.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;



    @GetMapping("/profile")
    public User getMyProfile(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);

        return userService.getUserByEmail(email);
    }

    @PutMapping("/update")
    public User updateProfile(@RequestHeader("Authorization") String authHeader,
                              @RequestBody UserUpdateRequest updateRequest) {

        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);

        return userService.updateProfile(email, updateRequest);
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(userService.getStatsForDashboard());
    }
    @GetMapping("/instructor-requests")
    public ResponseEntity<List<User>> getInstructorRequests() {
        return ResponseEntity.ok(userService.getUsersByRole(Role.STUDENT));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<String> updateUserRole(@PathVariable Long id, @RequestParam Role newRole) {
        userService.updateRole(id, newRole);
        return ResponseEntity.ok("User role updated to " + newRole);
    }
}