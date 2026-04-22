package com.lms.course.controller;

import com.lms.course.entity.Lesson;
import com.lms.course.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses/{courseId}/lessons")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    // Lesson එකක් ඇඩ් කරන්න
    @PostMapping("/add")
    public ResponseEntity<Lesson> addLesson(@PathVariable Long courseId, @RequestBody Lesson lesson) {
        return ResponseEntity.ok(lessonService.addLessonToCourse(courseId, lesson));
    }

    // Course එකකට අදාළ ඔක්කොම Lessons බලන්න
    @GetMapping("/all")
    public ResponseEntity<List<Lesson>> getLessons(@PathVariable Long courseId) {
        return ResponseEntity.ok(lessonService.getLessonsByCourseId(courseId));
    }
}