package com.jobportal.controller;

import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.Auth;
import com.jobportal.service.FileStorage;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController @RequestMapping("/api/profile")
public class ProfileController {
    private final UserRepository users; private final FileStorage storage;
    public ProfileController(UserRepository users, FileStorage storage) { this.users = users; this.storage = storage; }

    @PutMapping
    public User update(@RequestAttribute(value = "user", required = false) User user, @RequestBody Map<String, String> body) {
        Auth.require(user, null);
        if (body.get("name") != null && !body.get("name").isBlank()) user.name = body.get("name").trim();
        user.phone = body.get("phone");
        return users.save(user);
    }

    @PostMapping("/resume")
    public User uploadResume(@RequestAttribute(value = "user", required = false) User user, @RequestParam("file") MultipartFile file) {
        Auth.require(user, "CANDIDATE");
        user.resumeFile = storage.save(file);
        user.resumeName = file.getOriginalFilename();
        return users.save(user);
    }
}
