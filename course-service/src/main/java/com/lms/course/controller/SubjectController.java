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

    // 1. සියලුම Subjects ලබා ගැනීම (Frontend dropdown එකට)
    @GetMapping("/all")
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }

    // 2. අලුත් Subject එකක් ඇඩ් කිරීම
    @PostMapping("/add")
    public ResponseEntity<Subject> addSubject(@RequestBody Subject subject) {
        return ResponseEntity.ok(subjectService.saveSubject(subject));
    }

    // 3. පවතින Subject එකක් Update කිරීම
    @PutMapping("/update/{id}")
    public ResponseEntity<Subject> updateSubject(@PathVariable Long id, @RequestBody Subject subjectDetails) {
        return ResponseEntity.ok(subjectService.updateSubject(id, subjectDetails));
    }
}