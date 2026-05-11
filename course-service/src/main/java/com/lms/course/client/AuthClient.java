package com.lms.course.client;

import com.lms.course.dto.UserDetailResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "AUTH-SERVICE")
public interface AuthClient {

    @GetMapping("/auth/user-details")
    UserDetailResponse getUserDetails(@RequestHeader("Authorization") String token);
}