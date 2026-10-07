package com.jobportal.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Job {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    @ManyToOne public Company company;
    public String title;
    @Column(columnDefinition = "TEXT") public String description;
    public String skills;          // comma separated
    public String location;
    public Integer salaryMin, salaryMax; // annual
    public String employmentType;  // FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, REMOTE
    public boolean active = true;
    public LocalDateTime createdAt = LocalDateTime.now();
}
