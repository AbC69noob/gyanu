package com.digitalattendence.digitalattendencesystem.config;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    public GlobalExceptionHandler() {
        System.out.println("===== GlobalExceptionHandler Initialized =====");
    }

    // Handle JSON parsing errors (e.g. malformed JSON, wrong data types)
    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        
        System.err.println("===== JSON PARSING ERROR =====");
        System.err.println(ex.getMessage());
        
        Map<String, String> error = new HashMap<>();
        error.put("error", "Bad Request");
        error.put("message", "Invalid JSON format or data type. Check server logs for details.");
        error.put("details", ex.getMessage());
        
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Handle Validation errors (e.g. @NotNull, @Size)
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        
        System.err.println("===== VALIDATION ERROR =====");
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            System.err.println("Field: " + error.getField() + " - Message: " + error.getDefaultMessage())
        );
        
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
    
    // Handle generic exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        System.err.println("===== UNEXPECTED ERROR =====");
        ex.printStackTrace();
        
        Map<String, String> error = new HashMap<>();
        error.put("error", "Internal Server Error");
        error.put("message", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
