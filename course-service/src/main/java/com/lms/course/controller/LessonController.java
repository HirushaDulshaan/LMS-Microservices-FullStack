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

    @PostMapping("/add")
    public ResponseEntity<Lesson> addLesson(@PathVariable Long courseId, @RequestBody Lesson lesson) {
        return ResponseEntity.ok(lessonService.addLessonToCourse(courseId, lesson));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Lesson>> getLessons(@PathVariable Long courseId) {
        return ResponseEntity.ok(lessonService.getLessonsByCourseId(courseId));
    }

    @GetMapping("/{lessonId}")
    public ResponseEntity<Lesson> getLessonById(@PathVariable Long courseId, @PathVariable Long lessonId) {
        return ResponseEntity.ok(lessonService.getLessonById(courseId, lessonId));
    }

    @PutMapping("/update/{lessonId}")
    public ResponseEntity<Lesson> updateLesson(@PathVariable Long courseId,
                                               @PathVariable Long lessonId,
                                               @RequestBody Lesson lessonDetails) {
        return ResponseEntity.ok(lessonService.updateLesson(courseId, lessonId, lessonDetails));
    }

}