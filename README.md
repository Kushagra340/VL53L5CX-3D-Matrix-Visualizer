# 📡 VL53L5CX 8×8 Multizone Solid-State LiDAR 3D Web Visualizer

[![ESP32](https://img.shields.io/badge/MCU-ESP32_DevKit-red?style=for-the-badge&logo=espressif)](https://espressif.com/)
[![Sensor](https://img.shields.io/badge/Sensor-ST_VL53L5CX_8x8-blue?style=for-the-badge)]()
[![Three.js](https://img.shields.io/badge/Graphics-Three.js_WebGL-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

> **A real-time 3D spatial depth visualizer for the STMicroelectronics VL53L5CX 8×8 Time-of-Flight sensor matrix.**  
> The ESP32 polls 64 independent distance zones at 15Hz over Fast I2C (400kHz) and streams millimetric telemetry over Serial/WebSockets to a **Three.js WebGL 3D dashboard** where 64 interactive 3D columns morph dynamically in height and color.

---

## 📹 Video Demo

https://github.com/user-attachments/assets/PLACEHOLDER_REPLACE_WITH_ACTUAL_ASSET_ID

> *Live breadboard bringup of the ESP32 communicating with the VL53L5CX 8×8 sensor over 400kHz I2C.*  
> *(Video file located in [`media/tof_sensor_bringup.mp4`](media/tof_sensor_bringup.mp4) — upload to your GitHub Release/Issue to embed).*

---

## 🛠️ System Architecture

```
[ STMicroelectronics VL53L5CX (64-Zone Array) ]
                      │  Fast I2C (400kHz, GPIO 21 SDA, GPIO 22 SCL)
                      ▼
[ ESP32 Microcontroller (PlatformIO C++) ]
   ├── Configures 8x8 resolution at 15Hz
   └── Streams comma-separated frame: START,d0,d1,...,d63
                      │
                      ▼ (Web Serial API / 115200 Baud)
[ Three.js WebGL Dashboard ]
   ├── 8x8 Grid of 64 Dynamic 3D Box Geometries
   ├── Real-time Y-scale extrusion proportional to distance
   └── Dynamic Color Heatmap (Near = Cyan/Red, Far = Deep Blue)
```

---

## 📂 Repository Directory Structure

```text
VL53L5CX-3D-Matrix-Visualizer/
├── README.md                           # Master project guide & quickstart
├── firmware/                           # PlatformIO ESP32 firmware
│   ├── platformio.ini                  # Dependencies: SparkFun VL53L5CX library
│   └── src/main.cpp                    # 15Hz I2C acquisition & serial stream
├── webapp/                             # Three.js WebGL 3D depth visualizer
│   ├── index.html                      # Dark-mode WebGL canvas
│   ├── main.js                         # 64-bar geometry morphing & Web Serial parser
│   ├── style.css                       # Modern glassmorphism HUD styling
│   └── run_server.bat                  # Local HTTP server launcher
├── hardware/
│   └── wiring_diagram.md               # ESP32 pinout and power connections
├── docs/
│   └── solid_state_lidar_architecture.md # SPAD array physics & serial packet protocol
└── media/
    └── tof_sensor_bringup.mp4          # Sensor hardware bringup video
```

---

## 🚀 Quickstart
1. Flash [`firmware/`](firmware/) to your ESP32 using PlatformIO.
2. Launch [`webapp/run_server.bat`](webapp/run_server.bat) (or run `python -m http.server 8000`).
3. Open `http://localhost:8000` in Google Chrome or Edge.
4. Click **Connect Serial**, select your ESP32 COM port at 115200 baud, and watch the 3D depth bars come alive!

---
## 📜 License
Open-source under the [MIT License](LICENSE).
