package com.lms.course.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data; // ✅ මේක ඉම්පෝර්ට් කරන්න

@Entity
@Data // ✅ මේක දැම්මම setUserId, setLessonId ඔක්කොම ලෙඩ ඉවරයි!
public class LessonProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long lessonId;
    private Long courseId;
    private boolean isCompleted = true;
}