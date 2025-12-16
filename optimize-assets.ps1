# Asset Optimization Script
# This script helps compress images and audio files

Write-Host "Asset Optimization Helper" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host ""

# Check file sizes
$publicPath = ".\frontend\public"
$images = Get-ChildItem -Path "$publicPath\images" -Recurse -Include *.png,*.jpg,*.jpeg,*.gif -ErrorAction SilentlyContinue
$audio = Get-ChildItem -Path "$publicPath\audio" -Recurse -Include *.mp3,*.wav,*.ogg -ErrorAction SilentlyContinue

if ($images) {
    $totalImageSize = ($images | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "Total Image Size: $([math]::Round($totalImageSize, 2)) MB" -ForegroundColor Yellow
    Write-Host "Image Files: $($images.Count)" -ForegroundColor Yellow
}

if ($audio) {
    $totalAudioSize = ($audio | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "Total Audio Size: $([math]::Round($totalAudioSize, 2)) MB" -ForegroundColor Yellow
    Write-Host "Audio Files: $($audio.Count)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Recommendations:" -ForegroundColor Cyan
Write-Host "1. Convert PNG to WebP format (80-90% smaller)" -ForegroundColor White
Write-Host "2. Use Next.js Image component for automatic optimization" -ForegroundColor White
Write-Host "3. Move large assets to Supabase Storage" -ForegroundColor White
Write-Host "4. Compress audio files to MP3 at lower bitrate (128kbps)" -ForegroundColor White
Write-Host ""
Write-Host "To compress images online (free):" -ForegroundColor Cyan
Write-Host "  - TinyPNG: https://tinypng.com/" -ForegroundColor White
Write-Host "  - Squoosh: https://squoosh.app/" -ForegroundColor White
Write-Host ""
Write-Host "To use Supabase Storage (recommended):" -ForegroundColor Cyan
Write-Host "  1. Create a 'public-assets' bucket in Supabase" -ForegroundColor White
Write-Host "  2. Upload images/audio to bucket" -ForegroundColor White
Write-Host "  3. Get public URL: https://<project>.supabase.co/storage/v1/object/public/..." -ForegroundColor White
