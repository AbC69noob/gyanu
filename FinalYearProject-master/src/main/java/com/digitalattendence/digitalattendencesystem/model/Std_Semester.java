package com.digitalattendence.digitalattendencesystem.model;

import jakarta.persistence.*;



    @Entity
    @Table(name = "student_semester")
    public class Std_Semester {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "student_id", nullable = false)
        private Student student;

        @ManyToOne
        @JoinColumn(name = "semester_id", nullable = false)
        private Semester semester;

        private Integer status; // 1 = Active, 0 = Inactive (example)

        // Constructors
        public Std_Semester() {
        }

        public Std_Semester(Student student, Semester semester, Integer status) {
            this.student = student;
            this.semester = semester;
            this.status = status;
        }

        // Getters and Setters

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Student getStudent() {
            return student;
        }

        public void setStudent(Student student) {
            this.student = student;
        }

        public Semester getSemester() {
            return semester;
        }

        public void setSemester(Semester semester) {
            this.semester = semester;
        }

        public Integer getStatus() {
            return status;
        }

        public void setStatus(Integer status) {
            this.status = status;
        }
    }


