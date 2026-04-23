package com.lms.auth.authservice.service;

import com.lms.auth.authservice.dto.UserUpdateRequest;
import com.lms.auth.authservice.entity.Address;
import com.lms.auth.authservice.entity.User;
import com.lms.auth.authservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

        // Basic Info Update
        user.setFirstName(updateRequest.getFirstName());
        user.setLastName(updateRequest.getLastName());
        user.setMobileNumber(updateRequest.getMobileNumber());

        // Address Update (Null check එකක් දාමු ආරක්ෂාවට)
        if (updateRequest.getAddress() != null) {
            // දැනට ඇඩ්‍රස් එකක් නැත්නම් අලුත් එකක් හදනවා
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
}