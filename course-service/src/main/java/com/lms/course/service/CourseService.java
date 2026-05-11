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
        UserDetailResponse user = authClient.getUserDetails(token);

        if (!"TEACHER".equals(user.getRole()) && !"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Access Denied");
        }

        course.setTeacherId(user.getUserId());

        if (course.getInstructorName() == null || course.getInstructorName().trim().isEmpty()) {
            String fullName = (user.getFirstName() != null ? user.getFirstName() : "") + " " +
                    (user.getLastName() != null ? user.getLastName() : "");
            course.setInstructorName(fullName.trim());
        }

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

    public List<Course> getCoursesByInstructor(String token) {
        UserDetailResponse user = authClient.getUserDetails(token);

        if (!"TEACHER".equals(user.getRole()) && !"ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Access Denied: You are not an instructor.");
        }

        return courseRepository.findByTeacherId(user.getUserId());
    }

    public Course updateCourse(Long id, Course courseDetails, String token) {
        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));

        UserDetailResponse user = authClient.getUserDetails(token);

        if (!existingCourse.getTeacherId().equals(user.getUserId())) {
            throw new RuntimeException("Access Denied: You cannot update someone else's course.");
        }

        existingCourse.setTitle(courseDetails.getTitle());
        existingCourse.setDescription(courseDetails.getDescription());
        existingCourse.setPrice(courseDetails.getPrice());
        existingCourse.setLevel(courseDetails.getLevel());
        existingCourse.setThumbnailUrl(courseDetails.getThumbnailUrl());

        if (courseDetails.getSubject() != null && courseDetails.getSubject().getId() != null) {
            Subject subject = subjectRepository.findById(courseDetails.getSubject().getId())
                    .orElseThrow(() -> new RuntimeException("Subject not found"));
            existingCourse.setSubject(subject);
        }

        return courseRepository.save(existingCourse);
    }

    public List<Course> getCoursesByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }
        return courseRepository.findAllByIdIn(ids);
    }
}