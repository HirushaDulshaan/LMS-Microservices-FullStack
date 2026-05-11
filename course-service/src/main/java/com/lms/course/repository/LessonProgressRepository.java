package com.lms.course.repository;

import com.lms.course.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {

    Optional<LessonProgress> findByUserIdAndLessonId(Long userId, Long lessonId);

    long countByUserIdAndCourseId(Long userId, Long courseId);

    List<LessonProgress> findByUserIdAndCourseId(Long userId, Long courseId);
}