package com.boostmytool.beststore.controllers;

import com.boostmytool.beststore.models.User;
import com.boostmytool.beststore.services.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        Optional<User> existingUser = userService.findByEmail(user.getEmail());

        if (existingUser.isPresent() && existingUser.get().getPassword().equals(user.getPassword())) {
            response.put("message", "Login successful");
            response.put("user", existingUser.get());
        } else {
            response.put("error", "Invalid email or password");
        }
        return response;
    }

    @PostMapping("/logout")
    public Map<String, String> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "User logged out");
        return response;
    }

    @PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<User> existingUser = userService.findByEmail(user.getEmail());
        
        if (existingUser.isPresent()) {
            response.put("error", "User already exists");
        } else {
            User newUser = userService.saveUser(new User(user.getEmail(), user.getPassword()));
            response.put("message", "User registered successfully");
            response.put("user", newUser);
        }
        
        return response;
    }

}
