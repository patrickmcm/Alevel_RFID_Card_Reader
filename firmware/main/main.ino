#include "DisplayFunctions.h"
#include "RFIDFunctions.h"
#include "WIFIFunctions.h"
#include "configDevice.h"
#include "webSockets.h"
#include <EEPROM.h>
#include <time.h>
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
const char* ntpServer = "pool.ntp.org";
unsigned long epochTime;

void setup() {
  Serial.begin(115200);
  EEPROM.begin(1024);
  setupATECC508A();
  setupDisplay();
  setupWifi();
  configTime(0,0,ntpServer);
  setupDevice();
  setupRFID();
  EEPROM.end();

  showDataOnDisplay("place holder for loop",3);
}

void loop() {
  // make a heartbeat thing here





}
