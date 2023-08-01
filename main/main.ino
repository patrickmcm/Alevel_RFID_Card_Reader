#include "DisplayFunctions.h"
#include "RFIDFunctions.h"
#include "WIFIFunctions.h"
#include "configDevice.h"
#include <EEPROM.h>

/*
GOALS:
1. Make handshake (including backend)
2. Display flow on oled
3. make frontend


- For project sake physical security is out of scope
- Consider HMAC instead of ECC bc of overhead
- SPI can use shared pins only the CS (chip select) pin needs to be diffrent!


NOTES:
 - CHAR SIZE IS 6X8 PIXELS, INCREASES AS FACTOR WITH FONT SIZE
 - E.G. SETTEXTSIZE(3) IS 18X24 PIXELS

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
