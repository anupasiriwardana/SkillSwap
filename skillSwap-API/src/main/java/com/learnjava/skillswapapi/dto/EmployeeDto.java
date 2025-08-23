package com.learnjava.skillswapapi.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
//this class is to transfer data between client and server
public class EmployeeDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
}

//whenever we perform crud operation
//employeedto should be converted to employeejpa and vice versa

