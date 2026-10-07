package com.jobportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class Company {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    @OneToOne @JsonIgnore public User owner;
    public String name, website, location, industry, companySize;
    @Column(columnDefinition = "TEXT") public String description;
}
