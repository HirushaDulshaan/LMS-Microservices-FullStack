package com.lms.auth.authservice.repository;

import com.lms.auth.authservice.entity.User;
import com.lms.auth.authservice.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    long countByRole(Role role);
    List<User> findAllByRole(Role role);
}