package com.lms.auth.authservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class AuthConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF අක්‍රිය කරනවා
                .authorizeHttpRequests(auth -> auth
                        // 1. /auth යටතේ ඇති login, register, validate සියල්ලටම අවසර දෙනවා
                        .requestMatchers("/auth/**").permitAll()

                        // 2. /user යටතේ ඇති profile, update සියල්ලටම අවසර දෙනවා
                        .requestMatchers("/user/**").permitAll()

                        // 3. වෙනත් ඕනෑම request එකක් authenticated විය යුතුයි (නමුත් අපේ logic එකේ මේවා අඩුයි)
                        .anyRequest().permitAll()                )
                // 💡 වැදගත්: Session creation policy එක STATELESS කරනවා
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        return http.build();
    }
}