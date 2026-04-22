package com.lms.course.service;

import com.lms.course.client.AuthClient;
import com.lms.course.dto.UserDetailResponse;
import com.lms.course.entity.Course;
import com.lms.course.entity.Subject;
import com.lms.course.repository.CourseRepository;
import com.lms.course.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private AuthClient authClient;

    public Course createCourse(Course course, String token) {
        // 1. Auth-Service eken User Details ganna
        UserDetailResponse user = authClient.getUserDetails(token);

        // Teacher ho Admin dennatama permission denawa nam
        if (!"TEACHER".equals(user.getRole()) && !"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Access Denied: You don't have permission to create courses.");
        }

        // 2. Teacher ID eka set karanna (Meka thama null une)
        course.setTeacherId(user.getUserId());

        Subject subject = subjectRepository.findById(course.getSubject().getId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        course.setSubject(subject);
        return courseRepository.save(course);
    }
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }
    // CourseService.java ඇතුළත

    public List<Course> getCoursesByInstructor(String token) {
        // Auth-Service එකෙන් user response එක ගන්නවා
        UserDetailResponse user = authClient.getUserDetails(token);

        // වැරදීමකින්වත් ස්ටුඩන්ට් කෙනෙක් මේකට ආවොත් බ්ලොක් කරන්න
        if (!"TEACHER".equals(user.getRole()) && !"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Access Denied: You are not an instructor.");
        }

        // Teacher ID එකට අදාළ කෝස් ටික විතරක් අරන් එවනවා
        return courseRepository.findByTeacherId(user.getUserId());
    }
}