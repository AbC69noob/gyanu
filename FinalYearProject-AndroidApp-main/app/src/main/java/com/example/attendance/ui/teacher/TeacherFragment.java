package com.example.attendance.ui.teacher;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import java.io.IOException;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.attendance.databinding.FragmentTeacherBinding;
import com.example.attendance.models.Attendance;
import com.example.attendance.models.AttendanceRequest;
import com.example.attendance.models.Student;
import com.example.attendance.models.Subject;
import com.example.attendance.models.Teacher;
import com.example.attendance.network.RetrofitClient;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import com.google.android.material.tabs.TabLayout;

public class TeacherFragment extends Fragment {
    private static final String TAG = "TeacherFragment";

    private FragmentTeacherBinding binding;
    private SubjectCardAdapter subjectCardAdapter;
    private AttendanceAdapter attendanceAdapter;
    private TeacherAttendanceRecordAdapter viewAdapter;

    private Teacher currentTeacher;
    private List<Subject> allSubjects = new ArrayList<>();
    private List<Attendance> allAttendance = new ArrayList<>();

    private Subject selectedSubject;
    private String attendanceDate;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentTeacherBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        attendanceDate = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date());

        setupRecyclerViews();
        setupTabs();
        setupDatePicker();

        binding.btnSubmitAttendance.setOnClickListener(v -> submitAttendance());

        // Fetch data
        fetchCurrentTeacher();
        fetchAllSubjects();
        fetchAllAttendance();
    }

    private void setupRecyclerViews() {
        // Subject cards grid (2 columns)
        subjectCardAdapter = new SubjectCardAdapter();
        binding.rvSubjectCards.setLayoutManager(new GridLayoutManager(getContext(), 2));
        binding.rvSubjectCards.setAdapter(subjectCardAdapter);
        subjectCardAdapter.setOnSubjectSelectedListener(this::onSubjectSelected);

        // Attendance marking list
        attendanceAdapter = new AttendanceAdapter();
        binding.rvMarkAttendance.setLayoutManager(new LinearLayoutManager(getContext()));
        binding.rvMarkAttendance.setAdapter(attendanceAdapter);

        // View attendance history list
        viewAdapter = new TeacherAttendanceRecordAdapter();
        binding.rvViewAttendance.setLayoutManager(new LinearLayoutManager(getContext()));
        binding.rvViewAttendance.setAdapter(viewAdapter);
    }

    private void setupTabs() {
        binding.tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                if (tab.getPosition() == 0) {
                    binding.layoutMarkAttendance.setVisibility(View.VISIBLE);
                    binding.layoutViewAttendance.setVisibility(View.GONE);
                } else {
                    binding.layoutMarkAttendance.setVisibility(View.GONE);
                    binding.layoutViewAttendance.setVisibility(View.VISIBLE);
                    showFilteredAttendanceHistory();
                }
            }
            @Override
            public void onTabUnselected(TabLayout.Tab tab) {}
            @Override
            public void onTabReselected(TabLayout.Tab tab) {}
        });
    }

    private void setupDatePicker() {
        binding.tvAttendanceDate.setText(attendanceDate);
        binding.tvAttendanceDate.setOnClickListener(v -> {
            Calendar cal = Calendar.getInstance();
            new DatePickerDialog(getContext(), (view, year, month, dayOfMonth) -> {
                cal.set(year, month, dayOfMonth);
                attendanceDate = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(cal.getTime());
                binding.tvAttendanceDate.setText(attendanceDate);
                // Refresh already-marked status
                if (selectedSubject != null) {
                    loadStudentsForSubject(selectedSubject);
                }
            }, cal.get(Calendar.YEAR), cal.get(Calendar.MONTH), cal.get(Calendar.DAY_OF_MONTH)).show();
        });
    }

    private void fetchCurrentTeacher() {
        RetrofitClient.getApiService().getCurrentTeacher().enqueue(new Callback<Teacher>() {
            @Override
            public void onResponse(Call<Teacher> call, Response<Teacher> response) {
                if (response.isSuccessful() && response.body() != null) {
                    currentTeacher = response.body();
                    binding.tvWelcomeTeacher.setText("👋 Welcome, " + currentTeacher.getFullName());
                    // Re-filter subjects now that we have the teacher
                    filterAndShowSubjects();
                }
            }
            @Override
            public void onFailure(Call<Teacher> call, Throwable t) {
                Log.e(TAG, "Failed to fetch current teacher", t);
            }
        });
    }

    private void fetchAllSubjects() {
        RetrofitClient.getApiService().getSubjects().enqueue(new Callback<List<Subject>>() {
            @Override
            public void onResponse(Call<List<Subject>> call, Response<List<Subject>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    allSubjects = response.body();
                    filterAndShowSubjects();
                }
            }
            @Override
            public void onFailure(Call<List<Subject>> call, Throwable t) {
                Log.e(TAG, "Failed to fetch subjects", t);
            }
        });
    }

    private void fetchAllAttendance() {
        RetrofitClient.getApiService().getAttendance().enqueue(new Callback<List<Attendance>>() {
            @Override
            public void onResponse(Call<List<Attendance>> call, Response<List<Attendance>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    allAttendance = response.body();
                }
            }
            @Override
            public void onFailure(Call<List<Attendance>> call, Throwable t) {
                Log.e(TAG, "Failed to fetch attendance", t);
            }
        });
    }

    private void filterAndShowSubjects() {
        if (currentTeacher == null || allSubjects.isEmpty()) return;

        List<Subject> mySubjects = new ArrayList<>();
        for (Subject s : allSubjects) {
            if (s.getTeacher() != null && s.getTeacher().getId() == currentTeacher.getId()) {
                mySubjects.add(s);
            }
        }

        if (mySubjects.isEmpty()) {
            binding.tvNoSubjects.setVisibility(View.VISIBLE);
            binding.rvSubjectCards.setVisibility(View.GONE);
        } else {
            binding.tvNoSubjects.setVisibility(View.GONE);
            binding.rvSubjectCards.setVisibility(View.VISIBLE);
            subjectCardAdapter.setSubjects(mySubjects);
        }
    }

    private void onSubjectSelected(Subject subject) {
        selectedSubject = subject;

        // Show date picker and student list section
        binding.cardDatePicker.setVisibility(View.VISIBLE);
        binding.tvStudentListHeader.setVisibility(View.VISIBLE);
        binding.tvStudentListHeader.setText("Mark Attendance — " + subject.getName());
        binding.btnSubmitAttendance.setVisibility(View.VISIBLE);

        loadStudentsForSubject(subject);
    }

    private void loadStudentsForSubject(Subject subject) {
        if (subject.getProgram() == null || subject.getSemester() == null) {
            Toast.makeText(getContext(), "Subject missing program/semester info", Toast.LENGTH_SHORT).show();
            return;
        }

        int programId = subject.getProgram().getId();
        int semesterId = subject.getSemester().getId();

        RetrofitClient.getApiService().getStudentsByFilter(programId, semesterId)
                .enqueue(new Callback<List<Student>>() {
                    @Override
                    public void onResponse(Call<List<Student>> call, Response<List<Student>> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            List<Student> activeStudents = new ArrayList<>();
                            for (Student s : response.body()) {
                                if (s.getStatus() != 0) {
                                    activeStudents.add(s);
                                }
                            }
                            attendanceAdapter.setStudents(activeStudents);
                            // Set already-marked students
                            attendanceAdapter.setAlreadyMarked(getAlreadyMarkedIds(activeStudents));
                        }
                    }
                    @Override
                    public void onFailure(Call<List<Student>> call, Throwable t) {
                        if (getContext() != null)
                            Toast.makeText(getContext(), "Failed to fetch students", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    private List<Integer> getAlreadyMarkedIds(List<Student> students) {
        List<Integer> markedIds = new ArrayList<>();
        if (selectedSubject == null) return markedIds;

        for (Attendance a : allAttendance) {
            if (a.getSubject() != null && a.getSubject().getId() == selectedSubject.getId()
                    && a.getDate() != null && a.getDate().equals(attendanceDate)) {
                for (Student s : students) {
                    if (a.getStudent() != null && a.getStudent().getId() == s.getId()) {
                        markedIds.add(s.getId());
                    }
                }
            }
        }
        return markedIds;
    }

    private void showFilteredAttendanceHistory() {
        if (currentTeacher == null) {
            viewAdapter.setRecords(allAttendance);
            return;
        }

        // Show only attendance for subjects assigned to this teacher
        List<Integer> mySubjectIds = new ArrayList<>();
        for (Subject s : allSubjects) {
            if (s.getTeacher() != null && s.getTeacher().getId() == currentTeacher.getId()) {
                mySubjectIds.add(s.getId());
            }
        }

        List<Attendance> filtered = new ArrayList<>();
        for (Attendance a : allAttendance) {
            if (a.getSubject() != null && mySubjectIds.contains(a.getSubject().getId())) {
                filtered.add(a);
            }
        }
        viewAdapter.setRecords(filtered);
    }

    private void submitAttendance() {
        if (selectedSubject == null) {
            Toast.makeText(getContext(), "Please select a subject", Toast.LENGTH_SHORT).show();
            return;
        }

        Map<Integer, String> statuses = attendanceAdapter.getAttendanceStatuses();
        if (statuses.isEmpty()) {
            Toast.makeText(getContext(), "No attendance marked", Toast.LENGTH_SHORT).show();
            return;
        }

        Log.d(TAG, "Submitting attendance for date: " + attendanceDate + ", subjectId: " + selectedSubject.getId());

        int totalRequests = statuses.size();
        final int[] completedRequests = {0};
        final boolean[] anyFailure = {false};

        for (Map.Entry<Integer, String> entry : statuses.entrySet()) {
            AttendanceRequest request = new AttendanceRequest(attendanceDate, entry.getValue(), entry.getKey(), selectedSubject.getId());
            Log.d(TAG, "Posting attendance for student " + entry.getKey() + " with status " + entry.getValue());

            RetrofitClient.getApiService().markAttendance(request).enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    completedRequests[0]++;
                    if (!response.isSuccessful()) {
                        anyFailure[0] = true;
                        Log.e(TAG, "Failed to mark attendance. Code: " + response.code());
                        try {
                            if (response.errorBody() != null) {
                                Log.e(TAG, "Error body: " + response.errorBody().string());
                            }
                        } catch (IOException e) { e.printStackTrace(); }
                    }
                    checkCompletion(completedRequests[0], totalRequests, anyFailure[0]);
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    completedRequests[0]++;
                    anyFailure[0] = true;
                    Log.e(TAG, "Network failure", t);
                    checkCompletion(completedRequests[0], totalRequests, anyFailure[0]);
                }
            });
        }
    }

    private void checkCompletion(int completed, int total, boolean failed) {
        if (completed == total) {
            if (failed) {
                Toast.makeText(getContext(), "Some attendance records failed to save.", Toast.LENGTH_LONG).show();
            } else {
                Toast.makeText(getContext(), "All attendance records saved successfully!", Toast.LENGTH_SHORT).show();
                // Refresh attendance data
                fetchAllAttendance();
                // Switch to View tab
                if (binding.tabLayout.getTabAt(1) != null) {
                    binding.tabLayout.getTabAt(1).select();
                }
            }
        }
    }
}
