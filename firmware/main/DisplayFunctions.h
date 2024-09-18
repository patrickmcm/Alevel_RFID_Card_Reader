#ifndef DISPLAY_FUNCTIONS_H
#define DISPLAY_FUNCTIONS_H

#include "Adafruit_GFX.h"
#include "Adafruit_ILI9341.h"

// Error codes
#define CRYPTO_IC_DC 0
#define HTTP_REG_FAIL 1

// Function prototypes
void setupDisplay();
void showDataOnDisplay(String uid, uint8_t size);
void showErrorMessage(int err);
void displayStartupConnection();
void displayRegisterServer(int attempt);
void registerMessage(int otc);
void setupWifiMessage();

#endif
