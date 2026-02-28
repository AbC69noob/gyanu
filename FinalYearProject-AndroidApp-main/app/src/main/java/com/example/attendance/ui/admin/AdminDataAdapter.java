package com.example.attendance.ui.admin;

import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.attendance.databinding.ItemStudentBinding;
import com.example.attendance.models.Program;
import com.example.attendance.models.Student;
import com.example.attendance.models.Subject;
import com.example.attendance.models.Teacher;

import java.util.ArrayList;
import java.util.List;

public class AdminDataAdapter extends RecyclerView.Adapter<AdminDataAdapter.ViewHolder> {
    public interface OnEditListener {
        void onEdit(Object item);
    }

    private List<Object> items = new ArrayList<>();
    private String currentType = "";
    private OnEditListener editListener;

    public void setOnEditListener(OnEditListener listener) {
        this.editListener = listener;
    }

    public void setData(List<?> data, String type) {
        this.items = new ArrayList<>(data);
        this.currentType = type;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ItemStudentBinding binding = ItemStudentBinding.inflate(
                LayoutInflater.from(parent.getContext()), parent, false);
        return new ViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Object item = items.get(position);
        
        if (item instanceof Student) {
            Student s = (Student) item;
            holder.binding.tvName.setText(s.getName());
            holder.binding.tvRollNo.setText("Roll No: " + s.getRollNo());
            holder.binding.tvStatus.setText(s.getStatus() == 1 ? "Active" : "Inactive");
        } else if (item instanceof Program) {
            Program p = (Program) item;
            holder.binding.tvName.setText(p.getName());
            holder.binding.tvRollNo.setText("ID: " + p.getId());
            holder.binding.tvStatus.setText("Program");
        } else if (item instanceof Subject) {
            Subject s = (Subject) item;
            holder.binding.tvName.setText(s.getName());
            holder.binding.tvRollNo.setText("Code: " + s.getCode());
            holder.binding.tvStatus.setText("Subject");
        } else if (item instanceof Teacher) {
            Teacher t = (Teacher) item;
            holder.binding.tvName.setText(t.getFullName());
            holder.binding.tvRollNo.setText(t.getEmail());
            holder.binding.tvStatus.setText(t.getStatus() == 1 ? "Active" : "Inactive");
        }

        holder.binding.btnEdit.setOnClickListener(v -> {
            if (editListener != null) {
                editListener.onEdit(item);
            }
        });
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        ItemStudentBinding binding;
        ViewHolder(ItemStudentBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
    }
}
