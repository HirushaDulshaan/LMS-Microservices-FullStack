package com.lms.auth.authservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class AuthConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF disable karanna
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll() // /auth path ekata ena okkoma permit karanna
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    // PasswordEncoder Bean eka meke thiyenna ona (Oya hadala thibba nisa mama damma na)
}