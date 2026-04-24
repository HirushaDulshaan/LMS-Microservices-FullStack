package com.lms.course.entity;

import jakarta.persistence.*;
import lombok.Data; // ✅ Lombok තියෙනවා නම්
import java.time.LocalDateTime;

@Entity
@Data // ✅ මේක දැම්මම setProgressPercent සහ setCompleted ඔක්කොම ලෙඩ ඉවරයි!
public class CourseEnrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    private double progressPercent; // 👈 මේකට setter එකක් ඕනේ
    private boolean isCompleted;    // 👈 මේකට setter එකක් ඕනේ

    private LocalDateTime enrolledAt;

    // --- Lombok නැත්නම් විතරක් මේ ටික අතින් ලියන්න ---
    /*
    public void setProgressPercent(double progressPercent) {
        this.progressPercent = progressPercent;
    }

    public void setCompleted(boolean completed) {
        isCompleted = completed;
    }
    */
}