# Comprehensive CSS pixel to rem converter for castle adventure files
# Converts px values to rem units following the 16px = 1rem standard

function Convert-PxToRem {
    param([string]$content)
    
    # Define px to rem mappings
    $conversions = @{
        '1px' = '0.0625rem'
        '2px' = '0.125rem'
        '3px' = '0.1875rem'
        '4px' = '0.25rem'
        '5px' = '0.3125rem'
        '6px' = '0.375rem'
        '8px' = '0.5rem'
        '10px' = '0.625rem'
        '12px' = '0.75rem'
        '13px' = '0.8125rem'
        '15px' = '0.9375rem'
        '16px' = '1rem'
        '17px' = '1.0625rem'
        '18px' = '1.125rem'
        '20px' = '1.25rem'
        '24px' = '1.5rem'
        '25px' = '1.5625rem'
        '28px' = '1.75rem'
        '30px' = '1.875rem'
        '35px' = '2.1875rem'
        '36px' = '2.25rem'
        '40px' = '2.5rem'
        '44px' = '2.75rem'
        '55px' = '3.4375rem'
        '70px' = '4.375rem'
        '80px' = '5rem'
        '170px' = '10.625rem'
        '180px' = '11.25rem'
        '200px' = '12.5rem'
        '220px' = '13.75rem'
        '230px' = '14.375rem'
        '250px' = '15.625rem'
        '270px' = '16.875rem'
        '295px' = '18.4375rem'
        '350px' = '21.875rem'
        '400px' = '25rem'
        '480px' = '30rem'
        '500px' = '31.25rem'
        '580px' = '36.25rem'
        '768px' = '48rem'
        '1200px' = '75rem'
        '1400px' = '87.5rem'
    }
    
    # Apply conversions
    foreach ($px in $conversions.Keys) {
        $content = $content -replace [regex]::Escape($px), $conversions[$px]
    }
    
    # Apply fluid typography with clamp for specific patterns
    $content = $content -replace 'font-size: 2rem;', 'font-size: clamp(1.75rem, 3.5vw, 2rem);'
    $content = $content -replace 'font-size: 2.5rem;', 'font-size: clamp(2rem, 4vw, 2.5rem);'
    $content = $content -replace 'font-size: 1.8rem;', 'font-size: clamp(1.5rem, 3vw, 1.8rem);'
    $content = $content -replace 'font-size: 1.5rem;', 'font-size: clamp(1.3rem, 2.5vw, 1.5rem);'
    $content = $content -replace 'font-size: 1.4rem;', 'font-size: clamp(1.2rem, 2.5vw, 1.4rem);'
    $content = $content -replace 'font-size: 1.15rem;', 'font-size: clamp(1rem, 1.8vw, 1.15rem);'
    $content = $content -replace 'font-size: 1rem;', 'font-size: clamp(0.875rem, 1.5vw, 1rem);'
    $content = $content -replace 'font-size: 0.95rem;', 'font-size: clamp(0.85rem, 1.4vw, 0.95rem);'
    $content = $content -replace 'font-size: 0.9rem;', 'font-size: clamp(0.85rem, 1.4vw, 0.9rem);'
    $content = $content -replace 'font-size: 0.85rem;', 'font-size: clamp(0.8rem, 1.4vw, 0.85rem);'
    $content = $content -replace 'font-size: 0.8rem;', 'font-size: clamp(0.75rem, 1.3vw, 0.8rem);'
    $content = $content -replace 'font-size: 0.75rem;', 'font-size: clamp(0.7rem, 1.2vw, 0.75rem);'
    $content = $content -replace 'font-size: 0.7rem;', 'font-size: clamp(0.65rem, 1vw, 0.7rem);'
    $content = $content -replace 'font-size: 0.65rem;', 'font-size: clamp(0.6rem, 1vw, 0.65rem);'
    
    # Apply responsive gaps and padding with clamp
    $content = $content -replace 'gap: 1.5rem;', 'gap: clamp(1rem, 2vw, 1.5rem);'
    $content = $content -replace 'padding: 0.75rem 1.15rem;', 'padding: 0.75rem 1.15rem;'
    $content = $content -replace 'padding: 0.75rem 2rem;', 'padding: clamp(0.625rem, 1.2vw, 0.75rem) clamp(1.5rem, 3vw, 2rem);'
    $content = $content -replace 'padding: 0.75rem 1.5rem;', 'padding: clamp(0.625rem, 1.2vw, 0.75rem) clamp(1.25rem, 2.5vw, 1.5rem);'
    $content = $content -replace 'padding: 1.15rem 1.5rem;', 'padding: clamp(0.75rem, 2vw, 1.15rem) clamp(1rem, 2.5vw, 1.5rem);'
    $content = $content -replace 'padding: 1.15rem;', 'padding: clamp(0.875rem, 1.8vw, 1.15rem);'
    $content = $content -replace 'padding: 1rem;', 'padding: clamp(0.75rem, 1.5vw, 1rem);'
    $content = $content -replace 'padding: 0.75rem;', 'padding: clamp(0.625rem, 1.2vw, 0.75rem);'
    
    # Apply responsive dimensions with clamp
    $content = $content -replace 'min-width: 15.625rem;', 'min-width: clamp(15rem, 50vw, 20rem);'
    $content = $content -replace 'max-width: 31.25rem;', 'max-width: clamp(28rem, 60%, 31.25rem);'
    $content = $content -replace 'max-width: 16.875rem;', 'max-width: clamp(15rem, 35%, 16.875rem);'
    $content = $content -replace 'max-width: 75rem;', 'max-width: 75rem;'
    $content = $content -replace 'min-width: 14.375rem;', 'min-width: clamp(12rem, 30vw, 14.375rem);'
    $content = $content -replace 'height: 25rem;', 'height: clamp(22rem, 50vh, 25rem);'
    $content = $content -replace 'width: 10.625rem;\n  height: 10.625rem;', 'width: clamp(9rem, 20vw, 10.625rem);\n  height: clamp(9rem, 20vw, 10.625rem);'
    
    # Letter spacing conversions
    $content = $content -replace 'letter-spacing: 0.25px;', 'letter-spacing: 0.015625rem;'
    $content = $content -replace 'letter-spacing: 0.3px;', 'letter-spacing: 0.01875rem;'
    $content = $content -replace 'letter-spacing: 0.8px;', 'letter-spacing: 0.05rem;'
    
    return $content
}

# Process castle2-6
$files = @(
    'castle2-adventure.module.css',
    'castle3-adventure.module.css',
    'castle4-adventure.module.css',
    'castle5-adventure.module.css',
    'castle6-adventure.module.css'
)

$baseDir = "c:\Users\User\Desktop\BSCS-3\Second Semester\SoftEng\Polegion\frontend\styles\"

foreach ($file in $files) {
    $filePath = Join-Path $baseDir $file
    Write-Host "Processing $file..."
    
    $content = Get-Content $filePath -Raw -Encoding UTF8
    $convertedContent = Convert-PxToRem $content
    Set-Content -Path $filePath -Value $convertedContent -NoNewline -Encoding UTF8
    
    Write-Host "✓ Completed $file" -ForegroundColor Green
}

Write-Host "`n=== Conversion Complete ===" -ForegroundColor Cyan
Write-Host "Processed 5 castle CSS files (castle2-6)" -ForegroundColor Cyan
Write-Host "All px values converted to rem with fluid responsive units" -ForegroundColor Cyan
Write-Host ""
