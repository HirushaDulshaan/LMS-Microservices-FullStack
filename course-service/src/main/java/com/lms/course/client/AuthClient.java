package com.lms.course.client;

import com.lms.course.dto.UserDetailResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "AUTH-SERVICE") // Eureka wala register wela thiyena name eka
public interface AuthClient {

    // Auth-Service eke api issarahata hadana endpoint ekak meka
    // Token eka ewala userge role eka ganna
    @GetMapping("/auth/user-details")
    UserDetailResponse getUserDetails(@RequestHeader("Authorization") String token);
}