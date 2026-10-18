@echo off
echo Starting local web server for VL53L5CX Visualizer...
echo.
echo ==================================================
echo IMPORTANT: Web Serial API requires a local server.
echo Please open your browser and go to:
echo http://localhost:8000
echo ==================================================
echo.
echo Press Ctrl+C to stop the server.
python -m http.server 8000
