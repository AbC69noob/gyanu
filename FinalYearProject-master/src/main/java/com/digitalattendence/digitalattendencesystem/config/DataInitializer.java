package com.digitalattendence.digitalattendencesystem.config;

import com.digitalattendence.digitalattendencesystem.model.Role;
import com.digitalattendence.digitalattendencesystem.model.Semester;
import com.digitalattendence.digitalattendencesystem.repository.RoleRepository;
import com.digitalattendence.digitalattendencesystem.repository.SemesterRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(RoleRepository roleRepository, SemesterRepository semesterRepository) {
        return args -> {
            System.out.println("===== DATA INITIALIZER STARTED =====");
            
            // 1. Log existing roles to verify DB connection and data
            List<Role> existingRoles = roleRepository.findAll();
            System.out.println("Found " + existingRoles.size() + " roles in database:");
            for (Role r : existingRoles) {
                System.out.println(" - ID: " + r.getId() + ", Code: '" + r.getCode() + "', Name: '" + r.getName() + "'");
            }

            // 2. Seed missing roles
            createRoleIfNotFound(roleRepository, "ADM", "Admin");
            createRoleIfNotFound(roleRepository, "TEA", "Teacher");
            createRoleIfNotFound(roleRepository, "STD", "Student");

            // 3. Seed semesters if empty
            if (semesterRepository.count() == 0) {
                System.out.println("SEEDING SEMESTERS 1 to 8...");
                for (int i = 1; i <= 8; i++) {
                    Semester semester = new Semester();
                    semester.setNumber(i);
                    semesterRepository.save(semester);
                }
                System.out.println("SEMESTER SEEDING COMPLETED.");
            } else {
                System.out.println("SEMESTERS ALREADY PRESENT, SKIPPING SEEDING.");
            }
            
            System.out.println("===== DATA INITIALIZER FINISHED =====");
        };
    }

    private void createRoleIfNotFound(RoleRepository roleRepository, String code, String name) {
        Role role = roleRepository.findByCode(code);
        if (role == null) {
            Role newRole = new Role();
            newRole.setCode(code);
            newRole.setName(name);
            newRole.setStatus("ACTIVE");
            roleRepository.save(newRole);
            System.out.println("SEEDING ROLE: " + code);
        } else {
            System.out.println("FOUND ROLE: " + code);
        }
    }
}
