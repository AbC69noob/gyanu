$response = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -ContentType 'application/json' -Body (Get-Content login.json -Raw)
$response | ConvertTo-Json | Out-File -FilePath response.json
