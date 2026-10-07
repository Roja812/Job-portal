package com.jobportal.security;

import com.jobportal.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public final class Auth {
    private Auth() {}
    /** Throws 401 if not logged in, 403 if the role does not match. */
    public static User require(User user, String role) {
        if (user == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in to continue");
        if (role != null && !role.equals(user.role)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This action is not available for your account type");
        return user;
    }
}
