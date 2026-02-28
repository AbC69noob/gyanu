$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwb29qYSIsImlhdCI6MTc3MTg3MjU0MSwiZXhwIjoxNzcxOTA4NTQxfQ.4BoTSFGCL0xUwFCdA3n188FYW6YrNK5u12gMBAmpwu8"
    "Content-Type" = "application/json"
}
try {
    $response = Invoke-RestMethod -Uri 'http://localhost:8080/api/faculties' -Method Get -Headers $headers
    $response | ConvertTo-Json | Out-File -FilePath faculty_response.json
} catch {
    $_.Exception.Message | Out-File -FilePath faculty_error.txt
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.ReadToEnd() | Out-File -FilePath faculty_error_details.json
    }
}
