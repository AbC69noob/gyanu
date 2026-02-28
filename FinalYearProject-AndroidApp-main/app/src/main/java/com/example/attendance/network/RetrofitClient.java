package com.example.attendance.network;

import android.content.Context;
import com.example.attendance.utils.PreferenceManager;
import java.io.IOException;
import okhttp3.Interceptor;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetrofitClient {
    private static final String BASE_URL = "http://192.168.1.232:8080/"; // change ip address if needed.
    private static Retrofit retrofit = null;
    private static PreferenceManager preferenceManager;

    public static void init(Context context) {
        preferenceManager = new PreferenceManager(context);
    }

    public static ApiService getApiService() {
        if (retrofit == null) {
            HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
            logging.setLevel(HttpLoggingInterceptor.Level.BODY);

            OkHttpClient client = new OkHttpClient.Builder()
                    .addInterceptor(logging)
                    .addInterceptor(new Interceptor() {
                        @Override
                        public Response intercept(Chain chain) throws IOException {
                            Request original = chain.request();
                            Request.Builder requestBuilder = original.newBuilder();
                            
                            if (preferenceManager != null && preferenceManager.getToken() != null) {
                                requestBuilder.header("Authorization", "Bearer " + preferenceManager.getToken());
                            }
                            
                            return chain.proceed(requestBuilder.build());
                        }
                    })
                    .build();

            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .client(client)
                    .build();
        }
        return retrofit.create(ApiService.class);
    }
}
