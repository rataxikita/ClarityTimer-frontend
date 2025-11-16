# Script para ejecutar el frontend de ClarityTimer
# Uso: .\run-frontend.ps1

Write-Host "🚀 Iniciando ClarityTimer Frontend..." -ForegroundColor Cyan

# Verificar si Node.js está instalado
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCommand) {
    Write-Host "❌ Node.js no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

# Verificar si npm está instalado
$npmCommand = Get-Command npm -ErrorAction SilentlyContinue
if (-not $npmCommand) {
    Write-Host "❌ npm no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

# Verificar si node_modules existe
if (-not (Test-Path ".\node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

Write-Host "✅ Iniciando servidor de desarrollo..." -ForegroundColor Green
npm run dev

