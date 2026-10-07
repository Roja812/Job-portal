package com.jobportal.controller;

import com.jobportal.entity.*;
import com.jobportal.repository.*;
import com.jobportal.security.Auth;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;
import java.util.UUID;

@RestController @RequestMapping("/api/auth")
public class AuthController {
    record RegisterReq(String name, String email, String password, String role, String phone, String companyName) {}
    record LoginReq(String email, String password) {}

    private final UserRepository users; private final CompanyRepository companies;
    private final BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
    public AuthController(UserRepository users, CompanyRepository companies) { this.users = users; this.companies = companies; }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody RegisterReq r) {
        if (blank(r.name()) || blank(r.email()) || r.password() == null || r.password().length() < 6)
            throw bad("Name, email and a password of at least 6 characters are required");
        if (!"CANDIDATE".equals(r.role()) && !"RECRUITER".equals(r.role())) throw bad("Choose Job Seeker or Employer");
        String email = r.email().trim().toLowerCase();
        if (users.findByEmail(email).isPresent()) throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        User u = new User();
        u.name = r.name().trim(); u.email = email; u.phone = r.phone(); u.role = r.role();
        u.passwordHash = enc.encode(r.password());
        u.token = UUID.randomUUID().toString();
        users.save(u);
        if ("RECRUITER".equals(u.role)) {
            Company c = new Company(); c.owner = u; c.name = blank(r.companyName()) ? u.name + "'s company" : r.companyName().trim();
            companies.save(c);
        }
        return Map.of("token", u.token, "user", u);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginReq r) {
        User u = users.findByEmail(r.email() == null ? "" : r.email().trim().toLowerCase()).orElse(null);
        if (u == null || r.password() == null || !enc.matches(r.password(), u.passwordHash))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect email or password");
        u.token = UUID.randomUUID().toString();
        users.save(u);
        return Map.of("token", u.token, "user", u);
    }

    @GetMapping("/me")
    public User me(@RequestAttribute(value = "user", required = false) User user) { return Auth.require(user, null); }

    private static boolean blank(String s) { return s == null || s.isBlank(); }
    private static ResponseStatusException bad(String m) { return new ResponseStatusException(HttpStatus.BAD_REQUEST, m); }
}
