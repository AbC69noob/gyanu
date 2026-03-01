package com.example.attendance.ui.student;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.attendance.databinding.FragmentStudentBinding;
import com.example.attendance.models.Attendance;
import com.example.attendance.models.Student;
import com.example.attendance.network.RetrofitClient;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class StudentFragment extends Fragment {
    private static final String TAG = "StudentFragment";

    private FragmentStudentBinding binding;
    private AttendanceRecordAdapter adapter;
    private Student currentStudent;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentStudentBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        setupRecyclerView();
        fetchCurrentStudent();
    }

    private void setupRecyclerView() {
        adapter = new AttendanceRecordAdapter();
        binding.rvStudentAttendance.setLayoutManager(new LinearLayoutManager(getContext()));
        binding.rvStudentAttendance.setAdapter(adapter);
    }

    private void fetchCurrentStudent() {
        RetrofitClient.getApiService().getCurrentStudent().enqueue(new Callback<Student>() {
            @Override
            public void onResponse(Call<Student> call, Response<Student> response) {
                if (response.isSuccessful() && response.body() != null) {
                    currentStudent = response.body();
                    populateProfile();
                    fetchAttendance();
                } else {
                    Log.e(TAG, "Failed to fetch current student: " + response.code());
                }
            }

            @Override
            public void onFailure(Call<Student> call, Throwable t) {
                Log.e(TAG, "Network error fetching current student", t);
                Toast.makeText(getContext(), "Failed to load profile", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void populateProfile() {
        if (currentStudent == null) return;

        // Avatar initial
        String name = currentStudent.getName();
        if (name != null && !name.isEmpty()) {
            binding.tvAvatar.setText(String.valueOf(name.charAt(0)).toUpperCase());
        }

        // Name
        binding.tvStudentNameDisplay.setText(name != null ? name : "Student");

        // Program
        String programName = currentStudent.getProgram() != null
                ? currentStudent.getProgram().getName() : "Program";
        binding.tvProgramName.setText(programName);

        // Semester
        String semester = currentStudent.getSemester() != null
                ? String.valueOf(currentStudent.getSemester().getNumber()) : "-";
        binding.tvSemester.setText(semester);

        // Roll Number
        binding.tvRollNo.setText(currentStudent.getRollNo() != null ? currentStudent.getRollNo() : "-");
    }

    private void fetchAttendance() {
        RetrofitClient.getApiService().getAttendance().enqueue(new Callback<List<Attendance>>() {
            @Override
            public void onResponse(Call<List<Attendance>> call, Response<List<Attendance>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    // Filter for current student only
                    List<Attendance> myRecords = new ArrayList<>();
                    for (Attendance a : response.body()) {
                        if (a.getStudent() != null && currentStudent != null
                                && a.getStudent().getId() == currentStudent.getId()) {
                            myRecords.add(a);
                        }
                    }

                    // Sort by date (newest first)
                    Collections.sort(myRecords, (a, b) -> {
                        if (a.getDate() == null) return 1;
                        if (b.getDate() == null) return -1;
                        return b.getDate().compareTo(a.getDate());
                    });

                    updateStats(myRecords);

                    if (myRecords.isEmpty()) {
                        binding.tvNoRecords.setVisibility(View.VISIBLE);
                        binding.rvStudentAttendance.setVisibility(View.GONE);
                    } else {
                        binding.tvNoRecords.setVisibility(View.GONE);
                        binding.rvStudentAttendance.setVisibility(View.VISIBLE);
                        adapter.setRecords(myRecords);
                    }
                }
            }

            @Override
            public void onFailure(Call<List<Attendance>> call, Throwable t) {
                Toast.makeText(getContext(), "Failed to fetch attendance history", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void updateStats(List<Attendance> records) {
        int total = records.size();
        int present = 0;
        int absent = 0;
        int leave = 0;

        for (Attendance a : records) {
            String status = a.getStatus();
            if ("P".equals(status) || "PRESENT".equals(status)) present++;
            else if ("A".equals(status) || "ABSENT".equals(status)) absent++;
            else if ("L".equals(status) || "LEAVE".equals(status)) leave++;
        }

        int percent = total > 0 ? (present * 100) / total : 0;

        binding.tvAttendancePercent.setText(percent + "%");
        binding.tvTotalClasses.setText(String.valueOf(total));
        binding.tvPresentCount.setText(String.valueOf(present));
        binding.tvAbsentCount.setText(String.valueOf(absent));
    }
}
