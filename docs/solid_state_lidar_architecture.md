# 📡 ST VL53L5CX Solid-State LiDAR Matrix Architecture

## 1. Multizone Time-of-Flight Technology
Unlike legacy single-point laser distance sensors, the VL53L5CX integrates a **Single Photon Avalanche Diode (SPAD)** array and a 940nm Vertical-Cavity Surface-Emitting Laser (VCSEL) emitter:
- **Array Resolution**: 64 independent zones arranged in an 8×8 grid.
- **Diagonal Field of View (FoV)**: 45° (approx $34^\circ 	imes 34^\circ$).
- **Maximum Ranging Distance**: Up to 4,000 mm (4 meters) per zone.
- **Ranging Frequency**: 15 Hz for 8×8 mode.

## 2. Serial Packet Protocol
Firmware broadcasts comma-delimited frames over 115200 baud USB Serial:
`START,d0,d1,d2,...,d63\n`
Each value $d_i$ represents the target distance in millimeters.
