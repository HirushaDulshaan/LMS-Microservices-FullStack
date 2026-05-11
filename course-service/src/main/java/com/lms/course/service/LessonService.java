package com.lms.course.service;

import com.lms.course.entity.Course;
import com.lms.course.entity.CourseEnrollment;
import com.lms.course.entity.Lesson;
import com.lms.course.entity.LessonProgress;
import com.lms.course.repository.CourseEnrollmentRepository;
import com.lms.course.repository.CourseRepository;
import com.lms.course.repository.LessonProgressRepository;
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

    @Autowired
    private LessonProgressRepository lessonProgressRepository;

    @Autowired
    private CourseEnrollmentRepository enrollmentRepository;

    public Lesson addLessonToCourse(Long courseId, Lesson lesson) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        lesson.setCourse(course);
        return lessonRepository.save(lesson);
    }

    public List<Lesson> getLessonsByCourseId(Long courseId) {
        return lessonRepository.findByCourseId(courseId);
    }

    public Lesson getLessonById(Long courseId, Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        if (!lesson.getCourse().getId().equals(courseId)) {
            throw new RuntimeException("Lesson does not belong to this course");
        }
        return lesson;
    }

    public Lesson updateLesson(Long courseId, Long lessonId, Lesson lessonDetails) {
        Lesson existingLesson = getLessonById(courseId, lessonId);

        existingLesson.setTitle(lessonDetails.getTitle());
        existingLesson.setVideoUrl(lessonDetails.getVideoUrl());
        existingLesson.setContent(lessonDetails.getContent());

        return lessonRepository.save(existingLesson);
    }

}
