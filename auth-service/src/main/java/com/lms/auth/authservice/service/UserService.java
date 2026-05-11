package com.lms.auth.authservice.service;

import com.lms.auth.authservice.dto.UserUpdateRequest;
import com.lms.auth.authservice.entity.Address;
import com.lms.auth.authservice.entity.User;
import com.lms.auth.authservice.enums.Role;
import com.lms.auth.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(String email, UserUpdateRequest updateRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(updateRequest.getFirstName());
        user.setLastName(updateRequest.getLastName());
        user.setMobileNumber(updateRequest.getMobileNumber());

        if (updateRequest.getAddress() != null) {
            if (user.getAddress() == null) {
                user.setAddress(new Address());
            }

            user.getAddress().setStreetAddress(updateRequest.getAddress().getStreetAddress());
            user.getAddress().setCity(updateRequest.getAddress().getCity());
            user.getAddress().setPostalCode(updateRequest.getAddress().getPostalCode());
            user.getAddress().setCountry(updateRequest.getAddress().getCountry());
        }

        return userRepository.save(user);
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
    public Map<String, Object> getStatsForDashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", userRepository.countByRole(Role.STUDENT));
        stats.put("totalInstructors", userRepository.countByRole(Role.TEACHER));
        return stats;
    }
    public List<User> getUsersByRole(Role role) {
        return userRepository.findAllByRole(role);
    }

    public void updateRole(Long id, Role newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setRole(newRole);
        userRepository.save(user);
    }
}