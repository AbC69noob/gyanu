package com.example.attendance.ui;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import android.util.Log;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import com.example.attendance.R;
import com.example.attendance.databinding.ActivityMainBinding;
import com.example.attendance.network.RetrofitClient;
import com.example.attendance.ui.admin.AdminFragment;
import com.example.attendance.ui.student.StudentFragment;
import com.example.attendance.ui.teacher.TeacherFragment;
import com.example.attendance.utils.PreferenceManager;

public class MainActivity extends AppCompatActivity {

    private ActivityMainBinding binding;
    private PreferenceManager preferenceManager;
    private static final String TAG = "MainActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        if (binding.toolbar != null) {
            setSupportActionBar(binding.toolbar);
        }
        
        RetrofitClient.init(this);
        preferenceManager = new PreferenceManager(this);

        setupDashboard();
    }

    private void setupDashboard() {
        String role = preferenceManager.getRole();
        Log.d(TAG, "User Role: " + role);
        
        Fragment fragment;

        if (role == null) {
            Log.w(TAG, "Role is null, defaulting to StudentFragment");
            fragment = new StudentFragment();
            if (getSupportActionBar() != null) getSupportActionBar().setTitle("Student Dashboard");
        } else if (role.contains("ADMIN") || role.equalsIgnoreCase("ADM") || role.contains("ADM") || role.equalsIgnoreCase("user")) {
            fragment = new AdminFragment();
            if (getSupportActionBar() != null) getSupportActionBar().setTitle("Admin Dashboard");
        } else if (role.contains("TEACHER") || role.equalsIgnoreCase("TEA") || role.contains("TEA")) {
            fragment = new TeacherFragment();
            if (getSupportActionBar() != null) getSupportActionBar().setTitle("Teacher Dashboard");
        } else {
            fragment = new StudentFragment();
            if (getSupportActionBar() != null) getSupportActionBar().setTitle("Student Dashboard");
        }

        getSupportFragmentManager().beginTransaction()
                .replace(R.id.fragmentContainer, fragment)
                .commit();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == R.id.action_logout) {
            preferenceManager.clear();
            startActivity(new Intent(this, LoginActivity.class));
            finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
