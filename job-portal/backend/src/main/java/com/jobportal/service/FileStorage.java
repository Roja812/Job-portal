package com.jobportal.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorage {
    private final Path dir;
    public FileStorage(@Value("${app.upload-dir}") String d) throws IOException {
        dir = Paths.get(d).toAbsolutePath();
        Files.createDirectories(dir);
    }

    /** Saves a PDF/DOC/DOCX under a random name and returns that stored name. */
    public String save(MultipartFile f) {
        String orig = f.getOriginalFilename() == null ? "" : f.getOriginalFilename();
        String ext = orig.contains(".") ? orig.substring(orig.lastIndexOf('.') + 1).toLowerCase() : "";
        if (f.isEmpty() || !List.of("pdf", "doc", "docx").contains(ext))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Upload a PDF, DOC or DOCX file (max 5 MB)");
        String name = UUID.randomUUID() + "." + ext;
        try { f.transferTo(dir.resolve(name)); }
        catch (IOException e) { throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not store the file"); }
        return name;
    }
    public Resource load(String name) { return new FileSystemResource(dir.resolve(name)); }
}
