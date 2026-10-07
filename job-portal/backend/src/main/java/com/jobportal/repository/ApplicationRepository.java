package com.jobportal.repository;

import com.jobportal.entity.Application;
import com.jobportal.entity.Job;
import com.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    boolean existsByJobAndCandidate(Job job, User candidate);
    List<Application> findByCandidateOrderByAppliedAtDesc(User candidate);
    List<Application> findByJobCompanyOwnerOrderByAppliedAtDesc(User owner);
    void deleteByJob(Job job);
}
