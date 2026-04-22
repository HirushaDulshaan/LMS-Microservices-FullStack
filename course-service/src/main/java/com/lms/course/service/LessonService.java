package com.lms.course.service;

import com.lms.course.entity.Course;
import com.lms.course.entity.Lesson;
import com.lms.course.repository.CourseRepository;
import com.lms.course.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    public Lesson addLessonToCourse(Long courseId, Lesson lesson) {
        // 1. Course එක තියෙනවාද බලනවා
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

        // 2. Lesson එක Course එකට ලින්ක් කරනවා
        lesson.setCourse(course);
        return lessonRepository.save(lesson);
    }

    public List<Lesson> getLessonsByCourseId(Long courseId) {
        return lessonRepository.findByCourseId(courseId);
    }
}