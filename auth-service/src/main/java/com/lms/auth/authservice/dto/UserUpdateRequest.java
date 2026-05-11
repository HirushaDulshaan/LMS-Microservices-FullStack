package com.lms.auth.authservice.dto;

import com.lms.auth.authservice.entity.Address;
import lombok.Data;

@Data
public class UserUpdateRequest {
    private String firstName;
    private String lastName;
    private String mobileNumber;
    private Address address;
}