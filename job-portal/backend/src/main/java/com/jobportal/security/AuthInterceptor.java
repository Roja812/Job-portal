package com.jobportal.security;

import com.jobportal.entity.User;
import com.jobportal.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/** Reads "Authorization: Bearer <token>" and exposes the user as request attribute "user". */
@Component
public class AuthInterceptor implements HandlerInterceptor {
    private final UserRepository users;
    public AuthInterceptor(UserRepository users) { this.users = users; }

    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws Exception {
        String h = req.getHeader("Authorization");
        if (h == null || !h.startsWith("Bearer ")) return true; // public endpoints; controllers enforce roles
        User u = users.findByToken(h.substring(7)).orElse(null);
        if (u == null) { res.sendError(401, "Session expired, please log in again"); return false; }
        req.setAttribute("user", u);
        return true;
    }
}
