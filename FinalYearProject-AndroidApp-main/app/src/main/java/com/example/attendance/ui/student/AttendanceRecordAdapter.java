package com.example.attendance.ui.student;

import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.attendance.R;
import com.example.attendance.databinding.ItemAttendanceRecordBinding;
import com.example.attendance.models.Attendance;

import java.util.ArrayList;
import java.util.List;

public class AttendanceRecordAdapter extends RecyclerView.Adapter<AttendanceRecordAdapter.ViewHolder> {
    private List<Attendance> records = new ArrayList<>();

    public void setRecords(List<Attendance> records) {
        this.records = records;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemAttendanceRecordBinding binding = ItemAttendanceRecordBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false);
        return new ViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Attendance attendance = records.get(position);
        holder.binding.tvSubjectName.setText(attendance.getSubject() != null ? attendance.getSubject().getName() : "N/A");
        holder.binding.tvAttendanceDate.setText(attendance.getDate());
        
        String status = attendance.getStatus();
        holder.binding.tvAttendanceStatus.setText(status.equals("P") ? "PRESENT" : status.equals("A") ? "ABSENT" : "LEAVE");
        
        int badgeRes = R.drawable.badge_present;
        int colorRes = 0xFF065F46; // success green dark
        
        if (status.equals("A")) {
            badgeRes = R.drawable.badge_absent;
            colorRes = 0xFF991B1B; // error red dark
        } else if (status.equals("L")) {
            badgeRes = R.drawable.badge_leave;
            colorRes = 0xFF92400E; // warning yellow dark
        }
        
        holder.binding.tvAttendanceStatus.setBackgroundResource(badgeRes);
        holder.binding.tvAttendanceStatus.setTextColor(colorRes);
    }

    @Override
    public int getItemCount() {
        return records.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        ItemAttendanceRecordBinding binding;
        ViewHolder(ItemAttendanceRecordBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
    }
}
