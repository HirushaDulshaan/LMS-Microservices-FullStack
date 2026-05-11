package com.lms.course.dto;

import com.lms.course.entity.Subject;
import com.lms.course.entity.Lesson;
import lombok.Data;
import java.util.List;

@Data
public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String thumbnailUrl;
    private String level;
    private Long teacherId;
    private String instructorName;
    private Subject subject;
    private List<Lesson> lessons;
}