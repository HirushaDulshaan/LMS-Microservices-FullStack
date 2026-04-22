package com.lms.auth.authservice.service;

import com.lms.auth.authservice.entity.User;
import com.lms.auth.authservice.enums.Role;
import com.lms.auth.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository repository;

    @Autowired
    private JwtService jwtService;

    // AuthService.java ඇතුළත

    public String generateToken(String email, String password) {
        Optional<User> user = repository.findByEmail(email);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            // user.get().getRole().name() මඟින් "STUDENT" හෝ "ADMIN" වගේ String එකක් යනවා
            return jwtService.generateToken(email, user.get().getRole().name());
        } else {
            throw new RuntimeException("Invalid Access: Email or Password incorrect");
        }
    }

    public void validateToken(String token) {
        jwtService.validateToken(token);
    }

    public String saveUser(User user) {
        if (user.getRole() == null) {
            user.setRole(Role.STUDENT);
        }
        repository.save(user);
        return "User registered successfully with Role: " + user.getRole();
    }

    // Token eken email eka aran userwa hoyaganna meka ona
    public User getUserByEmail(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));
    }
}