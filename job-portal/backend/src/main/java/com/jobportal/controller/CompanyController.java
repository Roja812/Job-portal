package com.jobportal.controller;

import com.jobportal.entity.*;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.security.Auth;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController @RequestMapping("/api/company")
public class CompanyController {
    private final CompanyRepository companies;
    public CompanyController(CompanyRepository companies) { this.companies = companies; }

    @GetMapping("/me")
    public Company mine(@RequestAttribute(value = "user", required = false) User user) {
        Auth.require(user, "RECRUITER");
        return companies.findByOwner(user).orElseGet(Company::new);
    }

    @PutMapping("/me")
    public Company save(@RequestAttribute(value = "user", required = false) User user, @RequestBody Company in) {
        Auth.require(user, "RECRUITER");
        if (in.name == null || in.name.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Company name is required");
        Company c = companies.findByOwner(user).orElseGet(Company::new);
        c.owner = user; c.name = in.name.trim(); c.website = in.website; c.location = in.location;
        c.industry = in.industry; c.companySize = in.companySize; c.description = in.description;
        return companies.save(c);
    }
}
