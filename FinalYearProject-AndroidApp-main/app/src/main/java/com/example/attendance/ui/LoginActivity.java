package com.example.attendance.ui;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.attendance.databinding.ActivityLoginBinding;
import com.example.attendance.models.LoginRequest;
import com.example.attendance.models.LoginResponse;
import com.example.attendance.network.RetrofitClient;
import com.example.attendance.utils.PreferenceManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    private ActivityLoginBinding binding;
    private PreferenceManager preferenceManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityLoginBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        RetrofitClient.init(this);
        preferenceManager = new PreferenceManager(this);

        // Check if already logged in
        if (preferenceManager.getToken() != null) {
            startActivity(new Intent(this, MainActivity.class));
            finish();
        }

        binding.btnLogin.setOnClickListener(v -> handleLogin());
    }

    private void handleLogin() {
        String username = binding.etUsername.getText().toString().trim();
        String password = binding.etPassword.getText().toString().trim();

        if (username.isEmpty() || password.isEmpty()) {
            showError("Please fill in all fields");
            return;
        }

        setLoading(true);

        LoginRequest request = new LoginRequest(username, password);
        RetrofitClient.getApiService().login(request).enqueue(new LoginCallback());
    }

    private class LoginCallback implements Callback<LoginResponse> {
        @Override
        public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
            setLoading(false);
            if (response.isSuccessful() && response.body() != null) {
                LoginResponse res = response.body();
                preferenceManager.saveAuthDetails(res.getToken(), res.getRole());
                startActivity(new Intent(LoginActivity.this, MainActivity.class));
                finish();
            } else {
                showError("Invalid username or password");
            }
        }

        @Override
        public void onFailure(Call<LoginResponse> call, Throwable t) {
            setLoading(false);
            showError("Network error: " + t.getMessage());
        }
    }

    private void setLoading(boolean isLoading) {
        binding.progressBar.setVisibility(isLoading ? View.VISIBLE : View.GONE);
        binding.btnLogin.setVisibility(isLoading ? View.GONE : View.VISIBLE);
        binding.tvError.setVisibility(View.GONE);
    }

    private void showError(String message) {
        binding.tvError.setText(message);
        binding.tvError.setVisibility(View.VISIBLE);
    }
}
