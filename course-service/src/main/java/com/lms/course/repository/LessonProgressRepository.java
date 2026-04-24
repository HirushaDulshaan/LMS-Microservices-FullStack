package com.lms.course.repository;

import com.lms.course.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {

    // 1. යූසර් කෙනෙක් යම් කිසි පාඩමක් දැනටමත් ඉවර කරලද කියලා බලන්න
    Optional<LessonProgress> findByUserIdAndLessonId(Long userId, Long lessonId);

    // 2. යූසර් කෙනෙක් එක්තරා කෝර්ස් එකක් ඇතුළේ ඉවර කරලා තියෙන මුළු පාඩම් ගණන ගැනීමට
    // (මෙතනින් එන අගය තමයි අපි progress calculate කරන්න පාවිච්චි කරන්නේ)
    long countByUserIdAndCourseId(Long userId, Long courseId);

    // 3. යූසර් බලපු පාඩම් ලැයිස්තුවම අවශ්‍ය නම් (UI එකේ හරි ලකුණක් දාන්න වගේ)
    List<LessonProgress> findByUserIdAndCourseId(Long userId, Long courseId);
}