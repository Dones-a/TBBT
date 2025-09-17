@echo off
echo Creando archivos SVG para todos los episodios...

REM Crear script PowerShell para generar SVGs
(
echo function CreateSVG($season, $episode, $title^) {
echo     $colors = @^('FF6B23', 'F7931E', 'FFCC02', '8E44AD', 'E74C3C', '2ECC71'^)
echo     $bgColor = $colors[$episode %% $colors.Length]
echo     
echo     $svg = @"
echo ^<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225"^>
echo     ^<defs^>
echo         ^<linearGradient id="grad$season$episode" x1="0%%" y1="0%%" x2="100%%" y2="100%%"^>
echo             ^<stop offset="0%%" stop-color="#$bgColor"/^>
echo             ^<stop offset="100%%" stop-color="#2C3E50"/^>
echo         ^</linearGradient^>
echo     ^</defs^>
echo     ^<rect width="400" height="225" fill="url(#grad$season$episode^)"/^>
echo     ^<text x="200" y="100" font-family="Arial,sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white"^>S$season^E$episode^</text^>
echo     ^<text x="200" y="140" font-family="Arial,sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="white"^>The Big Bang Theory^</text^>
echo     ^<text x="200" y="180" font-family="Arial,sans-serif" font-size="12" text-anchor="middle" fill="rgba(255,255,255,0.8^)"^>$title^</text^>
echo ^</svg^>
echo "@
echo     
echo     $filename = "img\episodes\s$season^e$episode.svg"
echo     $svg ^| Out-File -FilePath $filename -Encoding UTF8
echo     Write-Host "Creado: $filename"
echo }
echo 
echo # Temporada 1
echo for ^($i = 1; $i -le 17; $i++^) {
echo     CreateSVG 1 $i "Episodio $i"
echo }
echo 
echo # Temporada 2  
echo for ^($i = 1; $i -le 23; $i++^) {
echo     CreateSVG 2 $i "Episodio $i"
echo }
echo 
echo Write-Host "¡SVGs creados para Temporadas 1 y 2!" -ForegroundColor Green
) > create_svgs.ps1

echo Ejecutando script PowerShell...
powershell -ExecutionPolicy Bypass -File create_svgs.ps1

echo Limpiando archivo temporal...
del create_svgs.ps1

echo ¡Completado! Archivos SVG creados en img\episodes\

