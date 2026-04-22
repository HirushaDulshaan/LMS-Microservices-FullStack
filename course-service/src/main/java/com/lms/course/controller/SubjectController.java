package com.lms.course.controller;

import com.lms.course.entity.Subject;
import com.lms.course.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses/subjects")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    // Frontend dropdown එකට අවශ්‍ය subjects ටික ගන්න
    @GetMapping("/all")
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }

    // අලුත් Subject එකක් ඇඩ් කරන්න
    @PostMapping("/add")
    public ResponseEntity<Subject> addSubject(@RequestBody Subject subject) {
        return ResponseEntity.ok(subjectService.saveSubject(subject));
    }
}