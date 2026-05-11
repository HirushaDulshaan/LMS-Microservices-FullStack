package com.lms.course.entity;

import jakarta.persistence.*;
import lombok.Data; // ✅ Lombok තියෙනවා නම්
import java.time.LocalDateTime;

@Entity
@Data
public class CourseEnrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    private double progressPercent;
    private boolean isCompleted;

    private LocalDateTime enrolledAt;


}