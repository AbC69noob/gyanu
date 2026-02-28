package com.digitalattendence.digitalattendencesystem.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@Service public class EmailService {
    @Autowired private JavaMailSender mailSender;
    public void sendOtpEmail(String toEmail, String otp)
    { SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail); message.setSubject("Password Reset OTP - Digital Attendance System");
        message.setText( "Hello,\n\n" + "Your OTP for password reset is: " + otp + "\n\nThis OTP will expire in 5 minutes." + "\n\nThank you." );
        mailSender.send(message); } }