package com.lms.course.repository;

import com.lms.course.entity.CourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {

    // 1. යූසර් ID එක සහ කෝර්ස් ID එක අනුව Enrollment එකක් තිබේදැයි බැලීමට
    // Progress update කරද්දී මේක ගොඩක් වැදගත් වෙනවා
    Optional<CourseEnrollment> findByUserIdAndCourseId(Long userId, Long courseId);

    // 2. යම්කිසි ශිෂ්‍යයෙක් එන්රෝල් වී ඇති සියලුම කෝර්ස් ලැයිස්තුව ගැනීමට
    // ශිෂ්‍යයාගේ Dashboard එකේ "My Courses" පෙන්වන්න මේක පාවිච්චි කරන්න පුළුවන්
    List<CourseEnrollment> findByUserId(Long userId);

    // 3. යම්කිසි කෝර්ස් එකකට එන්රෝල් වී සිටින සියලුම ශිෂ්‍යයන් බැලීමට (Admin/Instructor සඳහා)
    List<CourseEnrollment> findByCourseId(Long courseId);

    // 4. යූසර් කෙනෙක් දැනටමත් මේ කෝර්ස් එකට එන්රෝල් වෙලාද කියලා බලන්න (Boolean check)
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
}