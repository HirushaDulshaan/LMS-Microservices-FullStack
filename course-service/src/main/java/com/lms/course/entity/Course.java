package com.lms.course.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private Double price;
    private String thumbnailUrl;
    private String level;
    private Long teacherId;

    @ManyToOne(fetch = FetchType.EAGER) // EAGER දැම්මම subject එකත් එක්කම දත්ත එනවා
    @JoinColumn(name = "subject_id")
    // 👇 මේක පාවිච්චි කරන්න. එතකොට subject එක පේනවා, හැබැයි infinite loop වෙන්නේ නැහැ.
    @JsonIgnoreProperties("courses")
    private Subject subject;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Lesson> lessons;
}