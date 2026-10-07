package com.jobportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity @Table(name = "applications", uniqueConstraints = @UniqueConstraint(columnNames = {"job_id", "candidate_id"}))
public class Application {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    @ManyToOne(optional = false) public Job job;
    @ManyToOne(optional = false) public User candidate;
    @Column(columnDefinition = "TEXT") public String coverLetter;
    public String status = "APPLIED";
    public String resumeName;
    @JsonIgnore public String resumeFile;
    public LocalDateTime appliedAt = LocalDateTime.now();
}
