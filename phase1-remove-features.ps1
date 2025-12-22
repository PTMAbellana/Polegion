# Phase 1: Feature Removal Script
# Run this to clean up codebase for adaptive learning research

Write-Host "🧹 Starting Feature Removal for Adaptive Learning Research" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Confirm before proceeding
Write-Host "⚠️  This will DELETE competition, room, and teacher features" -ForegroundColor Yellow
Write-Host "Branch: research-adaptive-learning-mdp" -ForegroundColor Gray
$confirm = Read-Host "Continue? (yes/no)"

if ($confirm -ne "yes") {
    Write-Host "❌ Aborted" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "🗑️  Phase 1: Removing Backend Files..." -ForegroundColor Yellow

# Backend Controllers
$backendControllers = @(
    "backend/presentation/controllers/competitionController.js",
    "backend/presentation/controllers/roomController.js",
    "backend/presentation/controllers/leaderboardController.js"
)

foreach ($file in $backendControllers) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Removed: $file" -ForegroundColor Green
    }
}

# Backend Routes
$backendRoutes = @(
    "backend/presentation/routes/competitionRoutes.js",
    "backend/presentation/routes/roomRoutes.js"
)

foreach ($file in $backendRoutes) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Removed: $file" -ForegroundColor Green
    }
}

# Backend Services
$backendServices = @(
    "backend/application/services/competitionService.js",
    "backend/application/services/roomService.js",
    "backend/application/services/leaderboardService.js"
)

foreach ($file in $backendServices) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Removed: $file" -ForegroundColor Green
    }
}

# Backend Repositories
$backendRepos = @(
    "backend/infrastructure/repository/competitionRepository.js",
    "backend/infrastructure/repository/roomRepository.js"
)

foreach ($file in $backendRepos) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Removed: $file" -ForegroundColor Green
    }
}

# Backend Utils
$backendUtils = @(
    "backend/utils/GoogleAuth.js",
    "backend/utils/Mailer.js"
)

foreach ($file in $backendUtils) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Removed: $file" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🗑️  Phase 2: Removing Frontend Files..." -ForegroundColor Yellow

# Frontend Teacher Directory
if (Test-Path "frontend/app/teacher") {
    Remove-Item "frontend/app/teacher" -Recurse -Force
    Write-Host "  ✓ Removed: frontend/app/teacher/" -ForegroundColor Green
}

# Frontend Room Pages
if (Test-Path "frontend/app/student/rooms") {
    Remove-Item "frontend/app/student/rooms" -Recurse -Force
    Write-Host "  ✓ Removed: frontend/app/student/rooms/" -ForegroundColor Green
}

# Frontend Components
$frontendComponents = @(
    "frontend/components/competitions",
    "frontend/components/leaderboards",
    "frontend/components/rooms"
)

foreach ($dir in $frontendComponents) {
    if (Test-Path $dir) {
        Remove-Item $dir -Recurse -Force
        Write-Host "  ✓ Removed: $dir/" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✅ Feature Removal Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "  - Removed: Competition system" -ForegroundColor Gray
Write-Host "  - Removed: Virtual rooms" -ForegroundColor Gray
Write-Host "  - Removed: Teacher dashboard" -ForegroundColor Gray
Write-Host "  - Removed: Leaderboards" -ForegroundColor Gray
Write-Host "  - Kept: Student learning path & assessments" -ForegroundColor Gray
Write-Host ""
Write-Host "🔍 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Update backend/presentation/routes/index.js (remove deleted routes)" -ForegroundColor White
Write-Host "  2. Update frontend navigation (remove teacher/competition links)" -ForegroundColor White
Write-Host "  3. Run: npm install (both backend & frontend)" -ForegroundColor White
Write-Host "  4. Test: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📚 See: RESEARCH_IMPLEMENTATION_PLAN.md for full roadmap" -ForegroundColor Cyan
