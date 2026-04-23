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

        // ✅ 1. Frontend එකෙන් instructorName එකක් එවලා නැත්නම් විතරක් Auth-Service එකෙන් ගමු
        if (course.getInstructorName() == null || course.getInstructorName().trim().isEmpty()) {
            String fullName = (user.getFirstName() != null ? user.getFirstName() : "") + " " +
                    (user.getLastName() != null ? user.getLastName() : "");
            course.setInstructorName(fullName.trim());
        }
        // එවලා තියෙනවා නම් දැනටමත් course.instructorName එකේ ඒක තියෙනවා,
        // ඒ නිසා අපි ඒක අලුතින් සෙට් කරන්න ඕනේ නැහැ.

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
    // CourseService.java ඇතුළත මේක දාන්න

    public Course updateCourse(Long id, Course courseDetails, String token) {
        // 1. කලින් තියෙන කෝස් එක හොයාගමු
        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));

        // 2. ටෝකන් එකෙන් යූසර් කවුද කියලා හොයාගමු
        UserDetailResponse user = authClient.getUserDetails(token);

        // 3. ආරක්ෂක පියවර: මේ කෝස් එක අයිති මේ ටීචර්ටමද කියලා බලමු
        if (!existingCourse.getTeacherId().equals(user.getUserId())) {
            throw new RuntimeException("Access Denied: You cannot update someone else's course.");
        }

        // 4. දත්ත අප්ඩේට් කරමු
        existingCourse.setTitle(courseDetails.getTitle());
        existingCourse.setDescription(courseDetails.getDescription());
        existingCourse.setPrice(courseDetails.getPrice());
        existingCourse.setLevel(courseDetails.getLevel());
        existingCourse.setThumbnailUrl(courseDetails.getThumbnailUrl());

        // Subject එකත් වෙනස් කරන්න ඕනේ නම්:
        if (courseDetails.getSubject() != null && courseDetails.getSubject().getId() != null) {
            Subject subject = subjectRepository.findById(courseDetails.getSubject().getId())
                    .orElseThrow(() -> new RuntimeException("Subject not found"));
            existingCourse.setSubject(subject);
        }

        // 5. සේව් කරමු
        return courseRepository.save(existingCourse);
    }
}