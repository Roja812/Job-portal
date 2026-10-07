package com.jobportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity @Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    public String name;
    @Column(unique = true, nullable = false) public String email;
    public String phone;
    public String role; // CANDIDATE | RECRUITER
    public String resumeName;
    @JsonIgnore public String resumeFile;
    @JsonIgnore public String passwordHash;
    @JsonIgnore public String token;
}
