package com.jobportal.controller;

import com.jobportal.entity.*;
import com.jobportal.repository.*;
import com.jobportal.security.Auth;
import com.jobportal.service.FileStorage;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;

@RestController @RequestMapping("/api")
public class ApplicationController {
    static final List<String> STATUSES = List.of("APPLIED", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW", "HIRED", "REJECTED");
    private final ApplicationRepository apps; private final JobRepository jobs; private final FileStorage storage;
    public ApplicationController(ApplicationRepository apps, JobRepository jobs, FileStorage storage) {
        this.apps = apps; this.jobs = jobs; this.storage = storage;
    }

    @PostMapping("/jobs/{id}/apply")
    public Application apply(@RequestAttribute(value = "user", required = false) User user, @PathVariable Long id,
                             @RequestBody(required = false) Map<String, String> body) {
        Auth.require(user, "CANDIDATE");
        Job job = jobs.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
        if (!job.active) throw bad("This job is no longer accepting applications");
        if (user.resumeFile == null) throw bad("Upload your resume on your profile page before applying");
        if (apps.existsByJobAndCandidate(job, user)) throw new ResponseStatusException(HttpStatus.CONFLICT, "You have already applied to this job");
        Application a = new Application();
        a.job = job; a.candidate = user; a.resumeFile = user.resumeFile; a.resumeName = user.resumeName;
        a.coverLetter = body == null ? null : body.get("coverLetter");
        return apps.save(a);
    }

    @GetMapping("/applications/mine")
    public List<Application> mine(@RequestAttribute(value = "user", required = false) User user) {
        Auth.require(user, "CANDIDATE");
        return apps.findByCandidateOrderByAppliedAtDesc(user);
    }

    @GetMapping("/applications/recruiter")
    public List<Application> forRecruiter(@RequestAttribute(value = "user", required = false) User user) {
        Auth.require(user, "RECRUITER");
        return apps.findByJobCompanyOwnerOrderByAppliedAtDesc(user);
    }

    @PutMapping("/applications/{id}/status")
    public Application setStatus(@RequestAttribute(value = "user", required = false) User user, @PathVariable Long id, @RequestBody Map<String, String> body) {
        Auth.require(user, "RECRUITER");
        Application a = find(id);
        if (!a.job.company.owner.id.equals(user.id)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your job posting");
        if (!STATUSES.contains(body.get("status"))) throw bad("Unknown status");
        a.status = body.get("status");
        return apps.save(a);
    }

    @GetMapping("/applications/{id}/resume")
    public ResponseEntity<Resource> resume(@RequestAttribute(value = "user", required = false) User user, @PathVariable Long id) {
        Auth.require(user, null);
        Application a = find(id);
        if (!a.candidate.id.equals(user.id) && !a.job.company.owner.id.equals(user.id))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot view this resume");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + a.resumeName + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM).body(storage.load(a.resumeFile));
    }

    private Application find(Long id) { return apps.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found")); }
    private static ResponseStatusException bad(String m) { return new ResponseStatusException(HttpStatus.BAD_REQUEST, m); }
}
