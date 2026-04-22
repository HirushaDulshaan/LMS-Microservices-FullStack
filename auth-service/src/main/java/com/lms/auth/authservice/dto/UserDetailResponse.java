package com.lms.auth.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDetailResponse {
    private Long userId;
    private String role;
}
