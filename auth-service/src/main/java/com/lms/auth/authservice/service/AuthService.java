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
            // ✅ .intValue() අයින් කරලා කෙලින්ම getId() යවන්න (Long to Long)
            return jwtService.generateToken(email, user.get().getRole().name(), user.get().getId());
        } else {
            throw new RuntimeException("Invalid Access: Email or Password incorrect");
        }
    }

    // AuthService.java (AuthService project)
    public void validateToken(String token) {
        try {
            jwtService.validateToken(token); // Token එක expire වෙලාද බලනවා
            // 💡 වැදගත්: මෙතනදී යූසර්ව DB එකෙන් චෙක් කරනවා නම්,
            // ඒ යූසර් නැති වුණොත් Exception එකක් එන්න පුළුවන්.
        } catch (Exception e) {
            throw new RuntimeException("Invalid Access Token");
        }
    }
    public String saveUser(User user) {
        // හැමතිස්සෙම අලුත් Register වෙන කෙනෙක්ට STUDENT Role එක Force කරනවා
        user.setRole(Role.STUDENT);

        // Password එක encode කරන්න අමතක කරන්න එපා (පස්සේ කාලෙකදී BCrypt වගේ එකක් දාමු)
        repository.save(user);

        return "User registered successfully with Role: " + user.getRole();
    }

    // Token eken email eka aran userwa hoyaganna meka ona
    public User getUserByEmail(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));
    }
}