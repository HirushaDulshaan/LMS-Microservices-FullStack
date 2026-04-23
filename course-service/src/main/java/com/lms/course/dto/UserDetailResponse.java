package com.lms.course.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailResponse {
    private Long userId;
    private String role;
    private String firstName; // 👈 මේක ඇඩ් කරන්න
    private String lastName;  // 👈 මේකත් ඇඩ් කරන්න
}