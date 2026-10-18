#include <Arduino.h>
#include <Wire.h>
#include <SparkFun_VL53L5CX_Library.h>

SparkFun_VL53L5CX myImager;
VL53L5CX_ResultsData measurementData;

int imageResolution = 0;
int imageWidth = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("Initializing sensor board. This can take up to 10s. Please wait.");

  // Initialize I2C on standard ESP32 pins (SDA=21, SCL=22)
  Wire.begin(21, 22);
  // Increase I2C bus speed to 400kHz (Standard Fast Mode)
  Wire.setClock(400000);

  if (myImager.begin() == false) {
    Serial.println(F("Sensor not found - check your wiring. Freezing"));
    while (1) ;
  }

  // Set resolution to 8x8
  myImager.setResolution(8 * 8); 

  imageResolution = myImager.getResolution();
  imageWidth = sqrt(imageResolution);

  // Set ranging frequency (max 15Hz for 8x8)
  myImager.setRangingFrequency(15);

  myImager.startRanging();
  Serial.println("Ranging started! Output format: START,d0,d1,...,d63");
}

void loop() {
  if (myImager.isDataReady() == true) {
    if (myImager.getRangingData(&measurementData)) {
      // Print header
      Serial.print("START");

      for (int y = 0; y <= imageWidth * (imageWidth - 1); y += imageWidth) {
        for (int x = imageWidth - 1; x >= 0; x--) {
          Serial.print(",");
          // measurementData.distance_mm is a 1D array of size 64
          // The Sparkfun library reads it such that we iterate over the zones
          Serial.print(measurementData.distance_mm[x + y]);
        }
      }
      Serial.println();
    }
  }
}
