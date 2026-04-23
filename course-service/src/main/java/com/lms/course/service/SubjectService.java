package com.lms.course.service;

import com.lms.course.entity.Subject;
import com.lms.course.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Subject saveSubject(Subject subject) {
        return subjectRepository.save(subject);
    }
    // SubjectService.java ඇතුළත මේක දාන්න

    public Subject updateSubject(Long id, Subject subjectDetails) {
        // 1. කලින් තියෙන Subject එක හොයාගමු
        Subject existingSubject = subjectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subject not found with id: " + id));

        // 2. නම අප්ඩේට් කරමු
        existingSubject.setName(subjectDetails.getName());

        // 3. සේව් කරමු
        return subjectRepository.save(existingSubject);
    }
}