package com.lms.auth.authservice.repository;

import com.lms.auth.authservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Username nathi nisa api Email eken user hoyamu
    Optional<User> findByEmail(String email);
}