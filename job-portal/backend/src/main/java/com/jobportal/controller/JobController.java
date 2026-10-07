package com.jobportal.controller;

import com.jobportal.entity.*;
import com.jobportal.repository.*;
import com.jobportal.security.Auth;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController @RequestMapping("/api/jobs")
public class JobController {
    private final JobRepository jobs; private final CompanyRepository companies; private final ApplicationRepository apps;
    public JobController(JobRepository jobs, CompanyRepository companies, ApplicationRepository apps) {
        this.jobs = jobs; this.companies = companies; this.apps = apps;
    }

    private static String n(String s) { return s == null ? "" : s.trim(); }

    @GetMapping // public search: keyword, skill, location, type, minimum salary
    public List<Job> search(@RequestParam(required = false) String q, @RequestParam(required = false) String skill,
                            @RequestParam(required = false) String location, @RequestParam(required = false) String type,
                            @RequestParam(required = false) Integer minSalary) {
        return jobs.search(n(q), n(skill), n(location), n(type), minSalary == null ? 0 : minSalary);
    }

    @GetMapping("/{id}")
    public Job get(@PathVariable Long id) { return find(id); }

    @GetMapping("/mine")
    public List<Job> mine(@RequestAttribute(value = "user", required = false) User user) {
        Auth.require(user, "RECRUITER");
        return jobs.findByCompanyOwnerOrderByIdDesc(user);
    }

    @PostMapping
    public Job create(@RequestAttribute(value = "user", required = false) User user, @RequestBody Job in) {
        Auth.require(user, "RECRUITER");
        Company c = companies.findByOwner(user).orElseThrow(() -> bad("Create your company profile before posting a job"));
        Job j = new Job(); j.company = c;
        return jobs.save(copy(j, in));
    }

    @PutMapping("/{id}")
    public Job update(@RequestAttribute(value = "user", required = false) User user, @PathVariable Long id, @RequestBody Job in) {
        return jobs.save(copy(owned(user, id), in));
    }

    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) @Transactional
    public void delete(@RequestAttribute(value = "user", required = false) User user, @PathVariable Long id) {
        Job j = owned(user, id);
        apps.deleteByJob(j);
        jobs.delete(j);
    }

    private Job owned(User user, Long id) {
        Auth.require(user, "RECRUITER");
        Job j = find(id);
        if (!j.company.owner.id.equals(user.id)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only manage your own jobs");
        return j;
    }
    private Job find(Long id) { return jobs.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found")); }
    private static ResponseStatusException bad(String m) { return new ResponseStatusException(HttpStatus.BAD_REQUEST, m); }

    private Job copy(Job j, Job in) {
        if (in.title == null || in.title.isBlank() || in.description == null || in.description.isBlank()) throw bad("Title and description are required");
        if (in.salaryMin != null && in.salaryMax != null && in.salaryMin > in.salaryMax) throw bad("Minimum salary cannot exceed maximum salary");
        j.title = in.title.trim(); j.description = in.description; j.skills = in.skills; j.location = in.location;
        j.salaryMin = in.salaryMin; j.salaryMax = in.salaryMax; j.active = in.active;
        j.employmentType = in.employmentType == null || in.employmentType.isBlank() ? "FULL_TIME" : in.employmentType;
        return j;
    }
}
