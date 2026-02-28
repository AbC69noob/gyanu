package com.example.attendance.network;

import com.example.attendance.models.Attendance;
import com.example.attendance.models.AttendanceRequest;
import com.example.attendance.models.LoginRequest;
import com.example.attendance.models.LoginResponse;
import com.example.attendance.models.Program;
import com.example.attendance.models.Semester;
import com.example.attendance.models.Student;
import com.example.attendance.models.Subject;
import com.example.attendance.models.Teacher;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface ApiService {
    @POST("/api/auth/login")
    Call<LoginResponse> login(@Body LoginRequest loginRequest);

    // Student CRUD
    @GET("/api/student")
    Call<List<Student>> getStudents();

    @POST("/api/student")
    Call<Student> addStudent(@Body Student student);

    @PUT("/api/student/{id}")
    Call<Student> updateStudent(@Path("id") int id, @Body Student student);

    @DELETE("/api/student/{id}")
    Call<Void> deleteStudent(@Path("id") int id);

    @GET("/api/student/current")
    Call<Student> getCurrentStudent();

    @GET("/api/student/by-program-semester")
    Call<List<Student>> getStudentsByFilter(
            @Query("programId") int programId,
            @Query("semesterId") int semesterId
    );

    // Program CRUD
    @GET("/api/program")
    Call<List<Program>> getPrograms();

    @POST("/api/program")
    Call<Program> addProgram(@Body Program program);

    @PUT("/api/program/{id}")
    Call<Program> updateProgram(@Path("id") int id, @Body Program program);

    // Subject CRUD
    @GET("/subjects")
    Call<List<Subject>> getSubjects();

    @POST("/subjects")
    Call<Subject> addSubject(@Body Subject subject);

    @PUT("/subjects/{id}")
    Call<Subject> updateSubject(@Path("id") int id, @Body Subject subject);

    // Teacher CRUD
    @GET("/api/teachers")
    Call<List<Teacher>> getTeachers();

    @POST("/api/teachers")
    Call<Teacher> addTeacher(@Body Teacher teacher);

    @PUT("/api/teachers/{id}")
    Call<Teacher> updateTeacher(@Path("id") int id, @Body Teacher teacher);

    @GET("/api/teachers/current")
    Call<Teacher> getCurrentTeacher();

    // Attendance
    @GET("/api/attendance")
    Call<List<Attendance>> getAttendance();

    @POST("/api/attendance")
    Call<Void> markAttendance(@Body AttendanceRequest attendanceRequest);

    // Extra
    @GET("/semesters")
    Call<List<Semester>> getSemesters();
}
