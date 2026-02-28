package com.digitalattendence.digitalattendencesystem.repository;

import com.digitalattendence.digitalattendencesystem.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role,Integer> {

    Role findByCode(String code);
}
