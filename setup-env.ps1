# Script to check and update .env file
Write-Host "Checking .env file..."

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..."
    
    # Create .env file with sample content
    Set-Content -Path ".env" -Value "# Neon Database`nDATABASE_URL=`"postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require`"`n`n# Next.js`nNEXT_PUBLIC_APP_URL=`"http://localhost:3000`""
    
    Write-Host "Created .env file. Please update the database connection information."
} else {
    Write-Host ".env file already exists."
    
    # Check if DATABASE_URL exists in .env file
    $envContent = Get-Content ".env" -Raw
    if (-not ($envContent -match "DATABASE_URL=")) {
        Write-Host "DATABASE_URL not found in .env file. Adding..."
        
        # Add DATABASE_URL to .env file
        Add-Content -Path ".env" -Value "`n# Neon Database`nDATABASE_URL=`"postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require`""
        
        Write-Host "Added DATABASE_URL to .env file. Please update the database connection information."
    } else {
        Write-Host "DATABASE_URL already exists in .env file."
    }
}

# Display instructions
Write-Host "`nInstructions for updating DATABASE_URL:" -ForegroundColor Cyan
Write-Host "1. Open the .env file in a text editor" -ForegroundColor White
Write-Host "2. Find the line starting with DATABASE_URL=" -ForegroundColor White
Write-Host "3. Update the Neon PostgreSQL connection URL" -ForegroundColor White
Write-Host "4. Save the file and restart the server with 'npm run dev'" -ForegroundColor White

# Ask user if they want to open the .env file
$openFile = Read-Host "Do you want to open the .env file for editing? (y/n)"
if ($openFile -eq "y") {
    # Open .env file with default editor
    Invoke-Item ".env"
}
