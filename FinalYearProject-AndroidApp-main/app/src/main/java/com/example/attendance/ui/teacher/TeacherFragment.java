package com.example.attendance.ui.teacher;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Toast;

import java.io.IOException;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.attendance.databinding.FragmentTeacherBinding;
import com.example.attendance.models.Attendance;
import com.example.attendance.models.AttendanceRequest;
import com.example.attendance.models.Program;
import com.example.attendance.models.Semester;
import com.example.attendance.models.Student;
import com.example.attendance.models.Subject;
import com.example.attendance.network.RetrofitClient;
import com.example.attendance.utils.PreferenceManager;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import com.google.android.material.tabs.TabLayout;

public class TeacherFragment extends Fragment {
    private FragmentTeacherBinding binding;
    private AttendanceAdapter attendanceAdapter;
    private TeacherAttendanceRecordAdapter viewAdapter;
    private List<Program> programs = new ArrayList<>();
    private List<Semester> semesters = new ArrayList<>();
    private List<Subject> subjects = new ArrayList<>();

    private int selectedProgramId = -1;
    private int selectedSemesterId = -1;
    private int selectedSubjectId = -1;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentTeacherBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        setupRecyclerViews();
        setupSpinners();
        setupTabs();
        fetchPrograms();

        binding.btnSubmitAttendance.setOnClickListener(v -> submitAttendance());
    }

    private void setupRecyclerViews() {
        attendanceAdapter = new AttendanceAdapter();
        binding.rvMarkAttendance.setLayoutManager(new LinearLayoutManager(getContext()));
        binding.rvMarkAttendance.setAdapter(attendanceAdapter);

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
                    fetchAttendance();
                }
            }
            @Override
            public void onTabUnselected(TabLayout.Tab tab) {}
            @Override
            public void onTabReselected(TabLayout.Tab tab) {}
        });
    }

    private void fetchAttendance() {
        RetrofitClient.getApiService().getAttendance().enqueue(new Callback<List<Attendance>>() {
            @Override
            public void onResponse(Call<List<Attendance>> call, Response<List<Attendance>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    viewAdapter.setRecords(response.body());
                }
            }
            @Override
            public void onFailure(Call<List<Attendance>> call, Throwable t) {
                if (getContext() != null)
                    Toast.makeText(getContext(), "Failed to fetch attendance history", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void setupSpinners() {
        binding.spinnerProgram.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                if (position > 0) {
                    selectedProgramId = programs.get(position - 1).getId();
                    fetchSemesters();
                } else {
                    selectedProgramId = -1;
                    resetSemesterSpinner();
                    resetSubjectSpinner();
                }
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {}
        });

        binding.spinnerSemester.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                if (position > 0) {
                    selectedSemesterId = semesters.get(position - 1).getId();
                    fetchSubjects();
                    fetchStudents();
                } else {
                    selectedSemesterId = -1;
                    resetSubjectSpinner();
            attendanceAdapter.setStudents(new ArrayList<>());
                }
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {}
        });

        binding.spinnerSubject.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                if (position > 0) {
                    selectedSubjectId = subjects.get(position - 1).getId();
                } else {
                    selectedSubjectId = -1;
                }
            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {}
        });
    }

    private void fetchPrograms() {
        RetrofitClient.getApiService().getPrograms().enqueue(new Callback<List<Program>>() {
            @Override
            public void onResponse(Call<List<Program>> call, Response<List<Program>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    programs = response.body();
                    List<String> names = new ArrayList<>();
                    names.add("Select Program");
                    for (Program p : programs) names.add(p.getName());
                    
                    if (getContext() != null) {
                        ArrayAdapter<String> adapter = new ArrayAdapter<>(getContext(), android.R.layout.simple_spinner_item, names);
                        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                        binding.spinnerProgram.setAdapter(adapter);
                    }
                }
            }
            @Override
            public void onFailure(Call<List<Program>> call, Throwable t) {}
        });
    }

    private void fetchSemesters() {
        RetrofitClient.getApiService().getSemesters().enqueue(new Callback<List<Semester>>() {
            @Override
            public void onResponse(Call<List<Semester>> call, Response<List<Semester>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    semesters = response.body();
                    List<String> names = new ArrayList<>();
                    names.add("Select Semester");
                    for (Semester s : semesters) names.add("Semester " + s.getNumber());
                    
                    if (getContext() != null) {
                        ArrayAdapter<String> adapter = new ArrayAdapter<>(getContext(), android.R.layout.simple_spinner_item, names);
                        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                        binding.spinnerSemester.setAdapter(adapter);
                    }
                }
            }
            @Override
            public void onFailure(Call<List<Semester>> call, Throwable t) {}
        });
    }

    private void fetchSubjects() {
        RetrofitClient.getApiService().getSubjects().enqueue(new Callback<List<Subject>>() {
            @Override
            public void onResponse(Call<List<Subject>> call, Response<List<Subject>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    subjects = response.body();
                    List<String> names = new ArrayList<>();
                    names.add("Select Subject");
                    for (Subject s : subjects) names.add(s.getName());
                    
                    if (getContext() != null) {
                        ArrayAdapter<String> adapter = new ArrayAdapter<>(getContext(), android.R.layout.simple_spinner_item, names);
                        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
                        binding.spinnerSubject.setAdapter(adapter);
                    }
                }
            }
            @Override
            public void onFailure(Call<List<Subject>> call, Throwable t) {}
        });
    }

    private void fetchStudents() {
        if (selectedProgramId == -1 || selectedSemesterId == -1) return;

        RetrofitClient.getApiService().getStudentsByFilter(selectedProgramId, selectedSemesterId).enqueue(new Callback<List<Student>>() {
            @Override
            public void onResponse(Call<List<Student>> call, Response<List<Student>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    attendanceAdapter.setStudents(response.body());
                }
            }
            @Override
            public void onFailure(Call<List<Student>> call, Throwable t) {
                if (getContext() != null)
                    Toast.makeText(getContext(), "Failed to fetch students", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private static final String TAG = "TeacherFragment";

    private void submitAttendance() {
        if (selectedSubjectId == -1) {
            Toast.makeText(getContext(), "Please select a subject", Toast.LENGTH_SHORT).show();
            return;
        }

        Map<Integer, String> statuses = attendanceAdapter.getAttendanceStatuses();
        if (statuses.isEmpty()) {
            Toast.makeText(getContext(), "No attendance marked", Toast.LENGTH_SHORT).show();
            return;
        }

        String today = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date());
        Log.d(TAG, "Submitting attendance for date: " + today + ", subjectId: " + selectedSubjectId);
        
        int totalRequests = statuses.size();
        final int[] completedRequests = {0};
        final boolean[] anyFailure = {false};

        for (Map.Entry<Integer, String> entry : statuses.entrySet()) {
            AttendanceRequest request = new AttendanceRequest(today, entry.getValue(), entry.getKey(), selectedSubjectId);
            Log.d(TAG, "Posting attendance for student " + entry.getKey() + " with status " + entry.getValue());
            
            RetrofitClient.getApiService().markAttendance(request).enqueue(new Callback<Void>() {
                @Override
                public void onResponse(Call<Void> call, Response<Void> response) {
                    completedRequests[0]++;
                    if (!response.isSuccessful()) {
                        anyFailure[0] = true;
                        Log.e(TAG, "Failed to mark attendance for student " + request.getStudent().getId() + 
                                ". Code: " + response.code() + ", Message: " + response.message());
                        try {
                            if (response.errorBody() != null) {
                                Log.e(TAG, "Error body: " + response.errorBody().string());
                            }
                        } catch (IOException e) { e.printStackTrace(); }
                    } else {
                        Log.d(TAG, "Successfully marked attendance for student " + request.getStudent().getId());
                    }
                    
                    checkCompletion(completedRequests[0], totalRequests, anyFailure[0]);
                }

                @Override
                public void onFailure(Call<Void> call, Throwable t) {
                    completedRequests[0]++;
                    anyFailure[0] = true;
                    Log.e(TAG, "Network failure marking attendance for student " + request.getStudent().getId(), t);
                    checkCompletion(completedRequests[0], totalRequests, anyFailure[0]);
                }
            });
        }
    }

    private void checkCompletion(int completed, int total, boolean failed) {
        if (completed == total) {
            if (failed) {
                Toast.makeText(getContext(), "Some attendance records failed to save. Check logs.", Toast.LENGTH_LONG).show();
            } else {
                Toast.makeText(getContext(), "All attendance records saved successfully", Toast.LENGTH_SHORT).show();
                // Switching to View tab to reflect changes
                if (binding.tabLayout.getTabAt(1) != null) {
                    binding.tabLayout.getTabAt(1).select();
                }
            }
        }
    }

    private void resetSemesterSpinner() {
        if (getContext() != null) {
            List<String> names = new ArrayList<>();
            names.add("Select Semester");
            ArrayAdapter<String> adapter = new ArrayAdapter<>(getContext(), android.R.layout.simple_spinner_item, names);
            binding.spinnerSemester.setAdapter(adapter);
        }
    }

    private void resetSubjectSpinner() {
        if (getContext() != null) {
            List<String> names = new ArrayList<>();
            names.add("Select Subject");
            ArrayAdapter<String> adapter = new ArrayAdapter<>(getContext(), android.R.layout.simple_spinner_item, names);
            binding.spinnerSubject.setAdapter(adapter);
        }
    }
}
