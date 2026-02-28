package com.digitalattendence.digitalattendencesystem.controller;
import com.digitalattendence.digitalattendencesystem.dto.LoginResponse;
import com.digitalattendence.digitalattendencesystem.model.PasswordResetOtp;
import com.digitalattendence.digitalattendencesystem.model.User;
import com.digitalattendence.digitalattendencesystem.repository.PasswordResetOtpRepository;
import com.digitalattendence.digitalattendencesystem.repository.UserRepository;
import com.digitalattendence.digitalattendencesystem.service.CustomUserDetailsService;
import com.digitalattendence.digitalattendencesystem.config.JwtUtil;
import com.digitalattendence.digitalattendencesystem.dto.LoginRequest;
import com.digitalattendence.digitalattendencesystem.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetOtpRepository otpRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        System.out.println(loginRequest.getUsername());
        System.out.println(loginRequest.getPassword());

        try {
            // Authenticate username/password
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }

        // Load user details
        final UserDetails userDetails = userDetailsService
                .loadUserByUsername(loginRequest.getUsername());

        // ✅ Check if user is inactive
        if (userDetails instanceof com.digitalattendence.digitalattendencesystem.model.User) {
            com.digitalattendence.digitalattendencesystem.model.User user =
                    (com.digitalattendence.digitalattendencesystem.model.User) userDetails;

            if (!user.getStatus()) {  // if status is false
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "You have been blocked by admin"));
            }
        }

        // Generate JWT token for active users
        final String jwt = jwtUtil.generateToken(userDetails);

        // Fetch user from DB to get the role
        com.digitalattendence.digitalattendencesystem.model.User user =
                userRepository.findByUsername(loginRequest.getUsername()).orElse(null);

        String roleStr = (user != null && user.getRole() != null) ? user.getRole().getCode() : "";

        return ResponseEntity.ok(new LoginResponse(jwt, roleStr, "Login successful"));
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {

        String email = request.get("email");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email not found"));
        }

        String otpCode = String.valueOf((int)(Math.random() * 900000) + 100000);

        PasswordResetOtp otp = new PasswordResetOtp();
        otp.setUser(user);
        otp.setOtp(otpCode);
        otp.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otp.setUsed(false);

        otpRepository.save(otp);

        // TODO: send email here
        emailService.sendOtpEmail(user.getEmail(), otpCode);
        return ResponseEntity.ok(Map.of("message", "OTP sent to email"));
    }
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {

        String email = request.get("email");
        String otpCode = request.get("otp");

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid email"));
        }

        PasswordResetOtp otp = otpRepository
                .findTopByUserAndUsedFalseOrderByExpiryTimeDesc(user)
                .orElse(null);

        if (otp == null || !otp.getOtp().equals(otpCode)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid OTP"));
        }

        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "OTP expired"));
        }

        return ResponseEntity.ok(Map.of("message", "OTP verified"));
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String newPassword = request.get("newPassword");

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));


            // Encode password
            String encodedPassword = passwordEncoder.encode(newPassword);
            user.setPassword(encodedPassword);
            userRepository.save(user);

            // DEBUG: Log the encoded password (remove in production)
            System.out.println("Password reset for: " + email);
            System.out.println("New encoded password: " + encodedPassword);

            return ResponseEntity.ok(Map.of("message", "Password reset successful"));

        } catch (Exception e) {
            System.out.println("Reset password error: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Failed to reset password"));
        }
    }
}