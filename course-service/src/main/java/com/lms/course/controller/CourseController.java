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

    @PostMapping("/create")
    public ResponseEntity<Course> createCourse(@RequestBody Course course,
                                               @RequestHeader("Authorization") String token) {
        // 👇 මේක දාලා ලොග් එකේ බලන්න ටෝකන් එක ප්‍රින්ට් වෙනවද කියලා
        System.out.println("Received Token: " + token);

        if (token == null || !token.startsWith("Bearer ")) {
            System.out.println("❌ Token is missing or invalid format!");
        }

        return ResponseEntity.ok(courseService.createCourse(course, token));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }
    // CourseController.java ඇතුළත

    @GetMapping("/instructor/my")
    public ResponseEntity<List<Course>> getMyCourses(@RequestHeader("Authorization") String token) {
        // 1. Auth-Service එක හරහා Token එකෙන් User Details (ID) එක ගන්නවා
        // (මේක ඔයා දැනටමත් CourseService එකේ createCourse වලට පාවිච්චි කරලා තියෙන AuthClient එකමයි)
        return ResponseEntity.ok(courseService.getCoursesByInstructor(token));
    }
}