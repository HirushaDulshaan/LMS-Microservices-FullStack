package com.lms.course.repository;

import com.lms.course.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    // Specific teacher kenekge courses tika list karanna
    List<Course> findByTeacherId(Long teacherId);

    // Subject ID eken courses filter karanna
    List<Course> findBySubjectId(Long subjectId);
    // දීපු IDs ලිස්ට් එකේ තියෙන කෝර්ස් ටික විතරක් ගන්නවා
    List<Course> findAllByIdIn(List<Long> ids);
}