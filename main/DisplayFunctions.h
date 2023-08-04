#ifndef DISPLAY_FUNCTIONS_H
#define DISPLAY_FUNCTIONS_H

#include "Adafruit_GFX.h"
#include "Adafruit_ILI9341.h"

// Function prototypes
void setupDisplay();
void showDataOnDisplay(String uid);
void connectAttempt();
void registerMessage(int otc);
void setupWifiMessage();

#endif
