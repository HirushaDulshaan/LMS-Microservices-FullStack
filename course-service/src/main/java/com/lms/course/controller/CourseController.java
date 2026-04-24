package com.lms.course.controller;

import com.lms.course.entity.Course;
import com.lms.course.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    // 1. අලුත් කෝස් එකක් හැදීම
    @PostMapping("/create")
    public ResponseEntity<Course> createCourse(@RequestBody Course course,
                                               @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(courseService.createCourse(course, token));
    }

    // 2. සියලුම කෝස් ලබාගැනීම (Public)
    @GetMapping("/all")
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    // 3. තනි කෝස් එකක් ID එකෙන් ලබාගැනීම (Edit Page එකට අත්‍යවශ්‍යයි)
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    // 4. අදාළ ඉන්ස්ට්‍රක්ටර්ගේ කෝස් පමණක් ලබාගැනීම
    @GetMapping("/instructor/my")
    public ResponseEntity<List<Course>> getMyCourses(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(courseService.getCoursesByInstructor(token));
    }

    // 5. කෝස් එකක් Update කිරීම
    @PutMapping("/update/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id,
                                               @RequestBody Course courseDetails,
                                               @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(courseService.updateCourse(id, courseDetails, token));
    }
    @PostMapping("/by-ids")
    public ResponseEntity<List<Course>> getCoursesByIds(@RequestBody List<Long> ids) {
        return ResponseEntity.ok(courseService.getCoursesByIds(ids));
    }
}