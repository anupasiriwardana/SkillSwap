package com.learnjava.skillswapapi.repository;

import com.learnjava.skillswapapi.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
