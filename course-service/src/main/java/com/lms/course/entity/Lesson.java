package com.lms.course.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String videoUrl; // Video eke link eka (e.g., S3 ho YouTube)
    private String content;  // Text descriptions wage dewal

    @ManyToOne
    @JoinColumn(name = "course_id")
    @JsonBackReference
    private Course course;
}