package com.digitalattendence.digitalattendencesystem.repository;

import com.digitalattendence.digitalattendencesystem.model.PasswordResetOtp;
import com.digitalattendence.digitalattendencesystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

    public interface PasswordResetOtpRepository
            extends JpaRepository<PasswordResetOtp, Long> {

        Optional<PasswordResetOtp> findTopByUserAndUsedFalseOrderByExpiryTimeDesc(User user);
    }

