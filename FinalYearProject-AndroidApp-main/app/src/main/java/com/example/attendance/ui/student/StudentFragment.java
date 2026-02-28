package com.example.attendance.ui.student;

import android.os.Bundle;
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
import com.example.attendance.network.RetrofitClient;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class StudentFragment extends Fragment {
    private FragmentStudentBinding binding;
    private AttendanceRecordAdapter adapter;

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
        fetchAttendance();
    }

    private void setupRecyclerView() {
        adapter = new AttendanceRecordAdapter();
        binding.rvStudentAttendance.setLayoutManager(new LinearLayoutManager(getContext()));
        binding.rvStudentAttendance.setAdapter(adapter);
    }

    private void fetchAttendance() {
        RetrofitClient.getApiService().getAttendance().enqueue(new Callback<List<Attendance>>() {
            @Override
            public void onResponse(Call<List<Attendance>> call, Response<List<Attendance>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Attendance> records = response.body();
                    adapter.setRecords(records);
                    updateStats(records);
                }
            }

            @Override
            public void onFailure(Call<List<Attendance>> call, Throwable t) {
                Toast.makeText(getContext(), "Failed to fetch attendance history", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void updateStats(List<Attendance> records) {
        if (records.isEmpty()) return;

        int presentCount = 0;
        for (Attendance a : records) {
            if ("P".equals(a.getStatus())) presentCount++;
        }

        int percent = (presentCount * 100) / records.size();
        binding.tvAttendancePercent.setText(percent + "%");
        binding.tvTotalClasses.setText(String.valueOf(records.size()));
    }
}
