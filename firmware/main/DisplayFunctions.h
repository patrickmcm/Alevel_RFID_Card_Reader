#ifndef DISPLAY_FUNCTIONS_H
#define DISPLAY_FUNCTIONS_H

#include "Adafruit_GFX.h"
#include "Adafruit_ILI9341.h"

// Function prototypes
void setupDisplay();
void showDataOnDisplay(String uid, uint8_t size);
void showErrorMessage(String errMsg);
void displayStartupConnection();
void displayRegisterServer(int attempt);
void registerMessage(int otc);
void setupWifiMessage();

#endif
