package com.example.attendance.ui.teacher;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.attendance.databinding.ItemSubjectCardBinding;
import com.example.attendance.models.Subject;

import java.util.ArrayList;
import java.util.List;

public class SubjectCardAdapter extends RecyclerView.Adapter<SubjectCardAdapter.ViewHolder> {

    public interface OnSubjectSelectedListener {
        void onSubjectSelected(Subject subject);
    }

    private List<Subject> subjects = new ArrayList<>();
    private int selectedPosition = -1;
    private OnSubjectSelectedListener listener;

    public void setOnSubjectSelectedListener(OnSubjectSelectedListener listener) {
        this.listener = listener;
    }

    public void setSubjects(List<Subject> subjects) {
        this.subjects = subjects;
        this.selectedPosition = -1;
        notifyDataSetChanged();
    }

    public Subject getSelectedSubject() {
        if (selectedPosition >= 0 && selectedPosition < subjects.size()) {
            return subjects.get(selectedPosition);
        }
        return null;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemSubjectCardBinding binding = ItemSubjectCardBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false);
        return new ViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Subject subject = subjects.get(position);
        boolean isSelected = position == selectedPosition;

        holder.binding.tvSubjectName.setText(subject.getName() != null ? subject.getName() : "N/A");
        holder.binding.tvSubjectCode.setText(subject.getCode() != null ? subject.getCode() : "");
        holder.binding.tvProgramName.setText("🏛️ " + (subject.getProgram() != null ? subject.getProgram().getName() : "N/A"));
        holder.binding.tvSemesterNumber.setText("📅 Semester " + (subject.getSemester() != null ? subject.getSemester().getNumber() : "N/A"));

        // Selection state
        holder.binding.tvSelectedBadge.setVisibility(isSelected ? View.VISIBLE : View.GONE);

        if (isSelected) {
            holder.binding.cardSubject.setStrokeColor(Color.parseColor("#4f46e5"));
            holder.binding.cardSubject.setStrokeWidth(4);
            holder.binding.cardSubject.setCardBackgroundColor(Color.parseColor("#eef2ff"));
        } else {
            holder.binding.cardSubject.setStrokeColor(Color.parseColor("#e2e8f0"));
            holder.binding.cardSubject.setStrokeWidth(2);
            holder.binding.cardSubject.setCardBackgroundColor(Color.WHITE);
        }

        holder.itemView.setOnClickListener(v -> {
            int oldPos = selectedPosition;
            selectedPosition = holder.getAdapterPosition();
            if (oldPos >= 0) notifyItemChanged(oldPos);
            notifyItemChanged(selectedPosition);

            if (listener != null) {
                listener.onSubjectSelected(subject);
            }
        });
    }

    @Override
    public int getItemCount() {
        return subjects.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        ItemSubjectCardBinding binding;
        ViewHolder(ItemSubjectCardBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
    }
}
