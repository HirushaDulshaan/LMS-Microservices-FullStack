package com.lms.auth.authservice.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Address {
    private String streetAddress;
    private String city;
    private String postalCode;
    private String country;
}