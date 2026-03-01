package com.example.attendance.ui.student;

import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.attendance.R;
import com.example.attendance.databinding.ItemAttendanceRecordBinding;
import com.example.attendance.models.Attendance;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class AttendanceRecordAdapter extends RecyclerView.Adapter<AttendanceRecordAdapter.ViewHolder> {
    private List<Attendance> records = new ArrayList<>();
    private final SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
    private final SimpleDateFormat displayFormat = new SimpleDateFormat("MMM dd, yyyy", Locale.getDefault());

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

        // Format date nicely
        String dateStr = attendance.getDate();
        if (dateStr != null) {
            try {
                Date date = inputFormat.parse(dateStr);
                holder.binding.tvAttendanceDate.setText(date != null ? displayFormat.format(date) : dateStr);
            } catch (ParseException e) {
                holder.binding.tvAttendanceDate.setText(dateStr);
            }
        } else {
            holder.binding.tvAttendanceDate.setText("N/A");
        }

        String status = attendance.getStatus();
        String displayStatus;
        int badgeRes;
        int colorRes;

        if ("P".equals(status) || "PRESENT".equals(status)) {
            displayStatus = "PRESENT";
            badgeRes = R.drawable.badge_present;
            colorRes = 0xFF065F46;
        } else if ("A".equals(status) || "ABSENT".equals(status)) {
            displayStatus = "ABSENT";
            badgeRes = R.drawable.badge_absent;
            colorRes = 0xFF991B1B;
        } else {
            displayStatus = "LEAVE";
            badgeRes = R.drawable.badge_leave;
            colorRes = 0xFF92400E;
        }

        holder.binding.tvAttendanceStatus.setText(displayStatus);
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
