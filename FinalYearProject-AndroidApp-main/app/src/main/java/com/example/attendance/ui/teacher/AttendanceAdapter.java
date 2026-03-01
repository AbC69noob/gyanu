package com.example.attendance.ui.teacher;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.attendance.databinding.ItemAttendanceMarkBinding;
import com.example.attendance.models.Student;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AttendanceAdapter extends RecyclerView.Adapter<AttendanceAdapter.ViewHolder> {
    private List<Student> students = new ArrayList<>();
    private Map<Integer, String> attendanceStatuses = new HashMap<>();
    private List<Integer> alreadyMarkedIds = new ArrayList<>();

    public void setStudents(List<Student> students) {
        this.students = students;
        this.attendanceStatuses.clear();
        notifyDataSetChanged();
    }

    public void setAlreadyMarked(List<Integer> markedIds) {
        this.alreadyMarkedIds = markedIds;
        notifyDataSetChanged();
    }

    public Map<Integer, String> getAttendanceStatuses() {
        return attendanceStatuses;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemAttendanceMarkBinding binding = ItemAttendanceMarkBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false);
        return new ViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Student student = students.get(position);
        holder.binding.tvStudentName.setText(student.getName());
        holder.binding.tvRollNo.setText("Roll No: " + (student.getRollNo() != null ? student.getRollNo() : "N/A"));

        boolean isAlreadyMarked = alreadyMarkedIds.contains(student.getId());

        // Show/hide already marked badge
        holder.binding.tvAlreadyMarked.setVisibility(isAlreadyMarked ? View.VISIBLE : View.GONE);

        // Disable radio buttons if already marked
        holder.binding.rbPresent.setEnabled(!isAlreadyMarked);
        holder.binding.rbAbsent.setEnabled(!isAlreadyMarked);
        holder.binding.rbLeave.setEnabled(!isAlreadyMarked);

        // Reset radio group
        holder.binding.rgStatus.setOnCheckedChangeListener(null);
        holder.binding.rgStatus.clearCheck();

        String status = attendanceStatuses.get(student.getId());
        if (status != null) {
            switch (status) {
                case "P": holder.binding.rbPresent.setChecked(true); break;
                case "A": holder.binding.rbAbsent.setChecked(true); break;
                case "L": holder.binding.rbLeave.setChecked(true); break;
            }
        }

        holder.binding.rgStatus.setOnCheckedChangeListener((group, checkedId) -> {
            String selectedStatus = null;
            if (checkedId == holder.binding.rbPresent.getId()) selectedStatus = "P";
            else if (checkedId == holder.binding.rbAbsent.getId()) selectedStatus = "A";
            else if (checkedId == holder.binding.rbLeave.getId()) selectedStatus = "L";

            if (selectedStatus != null) {
                attendanceStatuses.put(student.getId(), selectedStatus);
            }
        });
    }

    @Override
    public int getItemCount() {
        return students.size();
    }

    public List<Student> getStudents() {
        return students;
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        ItemAttendanceMarkBinding binding;
        ViewHolder(ItemAttendanceMarkBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
    }
}
