# ⚡ VL53L5CX to ESP32 Hardware Wiring Guide

| ESP32 DevKit Pin | VL53L5CX Pin | Function | Notes |
| :---: | :---: | :--- | :--- |
| **3.3V** | **VCC** | Power | Regulated 3.3V logic power |
| **GND** | **GND** | Ground | Reference ground |
| **GPIO 21** | **SDA** | I2C Data | 400kHz Fast I2C bus |
| **GPIO 22** | **SCL** | I2C Clock | 400kHz Fast I2C clock |
| **GPIO 18** | **LPn** | Reset / Enable | Pulled LOW to reboot, HIGH to enable |
| **GPIO 19** | **INT** | Interrupt | Triggered when a new 8x8 frame is ready |
