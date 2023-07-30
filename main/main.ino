#include "DisplayFunctions.h"
#include "RFIDFunctions.h"
#include "WIFIFunctions.h"
#include "config.h"
#include <EEPROM.h>

/*
GOALS:
1. Make handshake (including backend)
2. Display flow on oled
3. make frontend


*/

void setup() {
  Serial.begin(115200);
  EEPROM.begin(1024);
  setupDisplay();
  setupWifi();
  if (EEPROM.read(110) == 0){
    setupDevice();
  }
  setupRFID();
  EEPROM.end();
}

void loop() {
  String uid;
  uid = getUID();
  showDataOnDisplay(uid);

  delay(20);
}
