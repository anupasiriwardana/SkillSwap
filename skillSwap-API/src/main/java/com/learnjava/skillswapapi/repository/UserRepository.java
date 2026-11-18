package com.learnjava.skillswapapi.repository;

import com.learnjava.skillswapapi.entity.Role;
import com.learnjava.skillswapapi.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(Role role);

    long countByRoleAndActiveFalse(Role role);

    /** Admin user list. Pass an empty string to skip the search. */
    @Query("""
            select u from User u
            where (:q = '' or lower(u.email) like :q
                   or lower(concat(u.firstName, ' ', u.lastName)) like :q)
            """)
    Page<User> search(@Param("q") String q, Pageable pageable);
}
