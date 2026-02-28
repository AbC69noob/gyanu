package com.example.attendance.ui.admin;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.example.attendance.databinding.FragmentAdminBinding;
import com.example.attendance.models.Program;
import com.example.attendance.models.Student;
import com.example.attendance.models.Subject;
import com.example.attendance.network.RetrofitClient;
import com.google.android.material.tabs.TabLayout;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import android.app.AlertDialog;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;

import com.example.attendance.databinding.DialogAddStudentBinding;
import com.example.attendance.databinding.DialogAddTeacherBinding;
import com.example.attendance.models.Semester;
import com.example.attendance.models.Teacher;

import java.util.ArrayList;

import com.example.attendance.databinding.DialogAddProgramBinding;
import com.example.attendance.databinding.DialogAddSubjectBinding;

public class AdminFragment extends Fragment {
    private FragmentAdminBinding binding;
    private AdminDataAdapter adapter;
    private List<Program> programsList = new ArrayList<>();
    private List<Semester> semestersList = new ArrayList<>();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentAdminBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        setupRecyclerView();
        setupTabs();
        fetchStats();
        
        binding.fabAdd.setOnClickListener(v -> handleAddFabClick());

        adapter.setOnEditListener(this::onEditItem);

        // Initial data fetch
        fetchStudents();
        fetchProgramsList(); // For students/subjects dialogs
        fetchSemestersList(); // For students/subjects dialogs
    }

    private void onEditItem(Object item) {
        if (item instanceof Student) showAddStudentDialog((Student) item);
        else if (item instanceof Teacher) showAddTeacherDialog((Teacher) item);
        else if (item instanceof Program) showAddProgramDialog((Program) item);
        else if (item instanceof Subject) showAddSubjectDialog((Subject) item);
    }

    private void handleAddFabClick() {
        int position = binding.categoryTabs.getSelectedTabPosition();
        if (position == 0) {
            showAddStudentDialog(null);
        } else if (position == 1) {
            showAddTeacherDialog(null);
        } else if (position == 2) {
            showAddProgramDialog(null);
        } else if (position == 3) {
            showAddSubjectDialog(null);
        }
    }

    private void setupRecyclerView() {
        adapter = new AdminDataAdapter();
        binding.rvAdminData.setLayoutManager(new LinearLayoutManager(getContext()));
        binding.rvAdminData.setAdapter(adapter);
    }

    private void setupTabs() {
        binding.categoryTabs.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                switch (tab.getPosition()) {
                    case 0: fetchStudents(); break;
                    case 1: fetchTeachers(); break;
                    case 2: fetchPrograms(); break;
                    case 3: fetchSubjects(); break;
                }
            }
            @Override
            public void onTabUnselected(TabLayout.Tab tab) {}
            @Override
            public void onTabReselected(TabLayout.Tab tab) {}
        });
    }

    private void fetchStats() {
        RetrofitClient.getApiService().getStudents().enqueue(new Callback<List<Student>>() {
            @Override
            public void onResponse(Call<List<Student>> call, Response<List<Student>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    binding.tvStudentCount.setText(String.valueOf(response.body().size()));
                }
            }
            @Override
            public void onFailure(Call<List<Student>> call, Throwable t) {}
        });

        RetrofitClient.getApiService().getPrograms().enqueue(new Callback<List<Program>>() {
            @Override
            public void onResponse(Call<List<Program>> call, Response<List<Program>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    binding.tvProgramCount.setText(String.valueOf(response.body().size()));
                }
            }
            @Override
            public void onFailure(Call<List<Program>> call, Throwable t) {}
        });
        
        RetrofitClient.getApiService().getTeachers().enqueue(new Callback<List<Teacher>>() {
            @Override
            public void onResponse(Call<List<Teacher>> call, Response<List<Teacher>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    binding.tvTeacherCount.setText(String.valueOf(response.body().size()));
                }
            }
            @Override
            public void onFailure(Call<List<Teacher>> call, Throwable t) {}
        });
    }

    private void fetchStudents() {
        RetrofitClient.getApiService().getStudents().enqueue(new Callback<List<Student>>() {
            @Override
            public void onResponse(Call<List<Student>> call, Response<List<Student>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    adapter.setData(response.body(), "Students");
                }
            }
            @Override
            public void onFailure(Call<List<Student>> call, Throwable t) {
                Toast.makeText(getContext(), "Failed to fetch students", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void fetchTeachers() {
        RetrofitClient.getApiService().getTeachers().enqueue(new Callback<List<Teacher>>() {
            @Override
            public void onResponse(Call<List<Teacher>> call, Response<List<Teacher>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    adapter.setData(response.body(), "Teachers");
                }
            }
            @Override
            public void onFailure(Call<List<Teacher>> call, Throwable t) {
                Toast.makeText(getContext(), "Failed to fetch teachers", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void fetchPrograms() {
        RetrofitClient.getApiService().getPrograms().enqueue(new Callback<List<Program>>() {
            @Override
            public void onResponse(Call<List<Program>> call, Response<List<Program>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    adapter.setData(response.body(), "Programs");
                }
            }
            @Override
            public void onFailure(Call<List<Program>> call, Throwable t) {}
        });
    }

    private void fetchSubjects() {
        RetrofitClient.getApiService().getSubjects().enqueue(new Callback<List<Subject>>() {
            @Override
            public void onResponse(Call<List<Subject>> call, Response<List<Subject>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    adapter.setData(response.body(), "Subjects");
                }
            }
            @Override
            public void onFailure(Call<List<Subject>> call, Throwable t) {}
        });
    }

    private void fetchProgramsList() {
        RetrofitClient.getApiService().getPrograms().enqueue(new Callback<List<Program>>() {
            @Override
            public void onResponse(Call<List<Program>> call, Response<List<Program>> response) {
                if (response.isSuccessful()) programsList = response.body();
            }
            @Override
            public void onFailure(Call<List<Program>> call, Throwable t) {}
        });
    }

    private void fetchSemestersList() {
        semestersList = new ArrayList<>();
        for (int i = 1; i <= 8; i++) {
            Semester s = new Semester();
            s.setId(i);
            s.setNumber(i);
            semestersList.add(s);
        }
    }

    private void showAddStudentDialog(Student studentToEdit) {
        DialogAddStudentBinding dialogBinding = DialogAddStudentBinding.inflate(getLayoutInflater());
        AlertDialog dialog = new AlertDialog.Builder(getContext())
                .setView(dialogBinding.getRoot())
                .create();

        if (studentToEdit != null) {
            dialogBinding.etStudentName.setText(studentToEdit.getName());
            dialogBinding.etRollNo.setText(studentToEdit.getRollNo());
            dialogBinding.btnAddStudent.setText("Update Student");
        }

        // Setup Spinners
        List<String> programNames = new ArrayList<>();
        programNames.add("Select Program");
        for (Program p : programsList) programNames.add(p.getName());
        ArrayAdapter<String> pAdapter = new ArrayAdapter<>(getContext(), android.R.layout.simple_spinner_item, programNames);
        pAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        dialogBinding.spinnerProgram.setAdapter(pAdapter);

        if (studentToEdit != null && studentToEdit.getProgram() != null) {
            for (int i = 0; i < programsList.size(); i++) {
                if (programsList.get(i).getId() == studentToEdit.getProgram().getId()) {
                    dialogBinding.spinnerProgram.setSelection(i + 1);
                    break;
                }
            }
        }

        List<String> semesterNames = new ArrayList<>();
        semesterNames.add("Select Semester");
        for (Semester s : semestersList) semesterNames.add("Semester " + s.getNumber());
        ArrayAdapter<String> sAdapter = new ArrayAdapter<>(getContext(), android.R.layout.simple_spinner_item, semesterNames);
        sAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        dialogBinding.spinnerSemester.setAdapter(sAdapter);

        if (studentToEdit != null && studentToEdit.getSemester() != null) {
            for (int i = 0; i < semestersList.size(); i++) {
                if (semestersList.get(i).getId() == studentToEdit.getSemester().getId()) {
                    dialogBinding.spinnerSemester.setSelection(i + 1);
                    break;
                }
            }
        }

        dialogBinding.btnAddStudent.setOnClickListener(v -> {
            String name = dialogBinding.etStudentName.getText().toString().trim();
            String roll = dialogBinding.etRollNo.getText().toString().trim();
            int pPos = dialogBinding.spinnerProgram.getSelectedItemPosition();
            int sPos = dialogBinding.spinnerSemester.getSelectedItemPosition();

            if (name.isEmpty() || roll.isEmpty() || pPos == 0 || sPos == 0) {
                Toast.makeText(getContext(), "Please fill all fields", Toast.LENGTH_SHORT).show();
                return;
            }

            Student s = studentToEdit != null ? studentToEdit : new Student();
            s.setName(name);
            s.setRollNo(roll);
            s.setProgram(programsList.get(pPos - 1));
            s.setSemester(semestersList.get(sPos - 1));
            s.setStatus(1);

            Call<Student> call = studentToEdit != null ? 
                RetrofitClient.getApiService().updateStudent(studentToEdit.getId(), s) :
                RetrofitClient.getApiService().addStudent(s);

            call.enqueue(new Callback<Student>() {
                @Override
                public void onResponse(Call<Student> call, Response<Student> response) {
                    if (response.isSuccessful()) {
                        Toast.makeText(getContext(), studentToEdit != null ? "Student updated" : "Student added", Toast.LENGTH_SHORT).show();
                        dialog.dismiss();
                        fetchStudents();
                        fetchStats();
                    }
                }
                @Override
                public void onFailure(Call<Student> call, Throwable t) {
                    Toast.makeText(getContext(), "Failed to save student", Toast.LENGTH_SHORT).show();
                }
            });
        });

        dialog.show();
    }

    private void showAddTeacherDialog(Teacher teacherToEdit) {
        DialogAddTeacherBinding dialogBinding = DialogAddTeacherBinding.inflate(getLayoutInflater());
        AlertDialog dialog = new AlertDialog.Builder(getContext())
                .setView(dialogBinding.getRoot())
                .create();

        if (teacherToEdit != null) {
            dialogBinding.etFullName.setText(teacherToEdit.getFullName());
            dialogBinding.etEmail.setText(teacherToEdit.getEmail());
            dialogBinding.etContact.setText(teacherToEdit.getContact());
            dialogBinding.btnAddTeacher.setText("Update Teacher");
        }

        dialogBinding.btnAddTeacher.setOnClickListener(v -> {
            String name = dialogBinding.etFullName.getText().toString().trim();
            String email = dialogBinding.etEmail.getText().toString().trim();
            String contact = dialogBinding.etContact.getText().toString().trim();

            if (name.isEmpty() || email.isEmpty() || contact.isEmpty()) {
                Toast.makeText(getContext(), "Please fill all fields", Toast.LENGTH_SHORT).show();
                return;
            }

            Teacher t = teacherToEdit != null ? teacherToEdit : new Teacher();
            t.setFullName(name);
            t.setEmail(email);
            t.setContact(contact);
            t.setStatus(1);

            Call<Teacher> call = teacherToEdit != null ?
                RetrofitClient.getApiService().updateTeacher(teacherToEdit.getId(), t) :
                RetrofitClient.getApiService().addTeacher(t);

            call.enqueue(new Callback<Teacher>() {
                @Override
                public void onResponse(Call<Teacher> call, Response<Teacher> response) {
                    if (response.isSuccessful()) {
                        Toast.makeText(getContext(), teacherToEdit != null ? "Teacher updated" : "Teacher added", Toast.LENGTH_SHORT).show();
                        dialog.dismiss();
                        fetchTeachers();
                        fetchStats();
                    }
                }
                @Override
                public void onFailure(Call<Teacher> call, Throwable t) {
                    Toast.makeText(getContext(), "Failed to save teacher", Toast.LENGTH_SHORT).show();
                }
            });
        });

        dialog.show();
    }

    private void showAddProgramDialog(Program programToEdit) {
        DialogAddProgramBinding dialogBinding = DialogAddProgramBinding.inflate(getLayoutInflater());
        AlertDialog dialog = new AlertDialog.Builder(getContext())
                .setView(dialogBinding.getRoot())
                .create();

        if (programToEdit != null) {
            dialogBinding.etProgramName.setText(programToEdit.getName());
            dialogBinding.btnAddProgram.setText("Update Program");
        }

        dialogBinding.btnAddProgram.setOnClickListener(v -> {
            String name = dialogBinding.etProgramName.getText().toString().trim();

            if (name.isEmpty()) {
                Toast.makeText(getContext(), "Please enter program name", Toast.LENGTH_SHORT).show();
                return;
            }

            Program p = programToEdit != null ? programToEdit : new Program();
            p.setName(name);

            Call<Program> call = programToEdit != null ?
                RetrofitClient.getApiService().updateProgram(programToEdit.getId(), p) :
                RetrofitClient.getApiService().addProgram(p);

            call.enqueue(new Callback<Program>() {
                @Override
                public void onResponse(Call<Program> call, Response<Program> response) {
                    if (response.isSuccessful()) {
                        Toast.makeText(getContext(), programToEdit != null ? "Program updated" : "Program added", Toast.LENGTH_SHORT).show();
                        dialog.dismiss();
                        fetchPrograms();
                        fetchStats();
                        fetchProgramsList(); // Update list for other spinners
                    }
                }
                @Override
                public void onFailure(Call<Program> call, Throwable t) {
                    Toast.makeText(getContext(), "Failed to save program", Toast.LENGTH_SHORT).show();
                }
            });
        });

        dialog.show();
    }

    private void showAddSubjectDialog(Subject subjectToEdit) {
        DialogAddSubjectBinding dialogBinding = DialogAddSubjectBinding.inflate(getLayoutInflater());
        AlertDialog dialog = new AlertDialog.Builder(getContext())
                .setView(dialogBinding.getRoot())
                .create();

        if (subjectToEdit != null) {
            dialogBinding.etSubjectName.setText(subjectToEdit.getName());
            dialogBinding.etSubjectCode.setText(subjectToEdit.getCode());
            dialogBinding.btnAddSubject.setText("Update Subject");
        }

        // Setup Spinners
        List<String> programNames = new ArrayList<>();
        programNames.add("Select Program");
        for (Program p : programsList) programNames.add(p.getName());
        ArrayAdapter<String> pAdapter = new ArrayAdapter<>(getContext(), android.R.layout.simple_spinner_item, programNames);
        pAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        dialogBinding.spinnerProgram.setAdapter(pAdapter);

        if (subjectToEdit != null && subjectToEdit.getProgram() != null) {
            for (int i = 0; i < programsList.size(); i++) {
                if (programsList.get(i).getId() == subjectToEdit.getProgram().getId()) {
                    dialogBinding.spinnerProgram.setSelection(i + 1);
                    break;
                }
            }
        }

        List<String> semesterNames = new ArrayList<>();
        semesterNames.add("Select Semester");
        for (Semester s : semestersList) semesterNames.add("Semester " + s.getNumber());
        ArrayAdapter<String> sAdapter = new ArrayAdapter<>(getContext(), android.R.layout.simple_spinner_item, semesterNames);
        sAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        dialogBinding.spinnerSemester.setAdapter(sAdapter);

        if (subjectToEdit != null && subjectToEdit.getSemester() != null) {
            for (int i = 0; i < semestersList.size(); i++) {
                if (semestersList.get(i).getId() == subjectToEdit.getSemester().getId()) {
                    dialogBinding.spinnerSemester.setSelection(i + 1);
                    break;
                }
            }
        }

        dialogBinding.btnAddSubject.setOnClickListener(v -> {
            String name = dialogBinding.etSubjectName.getText().toString().trim();
            String code = dialogBinding.etSubjectCode.getText().toString().trim();
            int pPos = dialogBinding.spinnerProgram.getSelectedItemPosition();
            int sPos = dialogBinding.spinnerSemester.getSelectedItemPosition();

            if (name.isEmpty() || code.isEmpty() || pPos == 0 || sPos == 0) {
                Toast.makeText(getContext(), "Please fill all fields", Toast.LENGTH_SHORT).show();
                return;
            }

            Subject s = subjectToEdit != null ? subjectToEdit : new Subject();
            s.setName(name);
            s.setCode(code);
            s.setProgram(programsList.get(pPos - 1));
            s.setSemester(semestersList.get(sPos - 1));

            Call<Subject> call = subjectToEdit != null ?
                RetrofitClient.getApiService().updateSubject(subjectToEdit.getId(), s) :
                RetrofitClient.getApiService().addSubject(s);

            call.enqueue(new Callback<Subject>() {
                @Override
                public void onResponse(Call<Subject> call, Response<Subject> response) {
                    if (response.isSuccessful()) {
                        Toast.makeText(getContext(), subjectToEdit != null ? "Subject updated" : "Subject added", Toast.LENGTH_SHORT).show();
                        dialog.dismiss();
                        fetchSubjects();
                        fetchStats();
                    }
                }
                @Override
                public void onFailure(Call<Subject> call, Throwable t) {
                    Toast.makeText(getContext(), "Failed to save subject", Toast.LENGTH_SHORT).show();
                }
            });
        });

        dialog.show();
    }
}
