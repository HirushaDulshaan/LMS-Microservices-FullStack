package com.lms.course.repository;

import com.lms.course.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    // Subject name eken search karanna puluwan method ekak
    Subject findByName(String name);
}