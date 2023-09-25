#include <SparkFun_ATECCX08a_Arduino_Library.h>
#include <Wire.h>

ATECCX08A atecc;

void setup() {
  // put your setup code here, to run once:
  Wire.begin();
  Serial.begin(115200);
  
  Serial.println("");

  if (atecc.begin() == true) {
    Serial.println("Device connected");
  } else {
    Serial.println("Error while connecting device");
  }
  // input the psk to be written to the device's crypto chip
  uint8_t psk[] = "2555885553752669D66245EBE549BCDE";
  
  for (int i = 0; i < sizeof(psk)-1; i++) {
    Serial.print((int)psk[i]);
    Serial.print(" ");
    if (i % 96 == 0 && i > 0) Serial.println();
  }


  Serial.println("");
  Serial.println("*** Type y/n to start config and write psk ***");
  Serial.println("*** THIS ACTION IS IRREVERSIBLE ***");

  while (Serial.available() == 0);

  if (Serial.read() == 'y') {
    if(!configDevice()) Serial.println("Failed write config"); return;
    atecc.lockConfig();
    if(!writePSK(psk)) {Serial.println("Failed write PSK"); return;} 
    else Serial.println("Wrote PSK to Slot 0 successfully!");
    Serial.println("*** Intial Config Complete, go test the hmac now. ***")
    Serial.println("*** Once good, come back and type 'lock'")
  } else if(Serial.readString() == "lock"){
    atecc.lockDataAndOTP();
  }
}

void loop() {
  // put your main code here, to run repeatedly:
}


bool configDevice() {
  uint8_t config[] = { 0x83, 0x20, 0x83, 0x20 };
  uint8_t keyConfig[] = { 0x1C, 0x00, 0x1C, 0x00 };

  if (!atecc.write(0x00, 0x0005, config, 4)) {
    printOutputBuffer();
    return false;
  }

  delay(10);
  Serial.println("Set SlotConfig Successfully.");

  if (!atecc.write(0x00, 0x0018, keyConfig, 4)) {
    printOutputBuffer();
    return false;
  }

  delay(10);
  Serial.println("Set KeyConfig Successfully.");
  return true;

}

bool writePSK(uint8_t* psk) {
  if (!atecc.write(0x02, 0x0000, psk, 32)) {
    printOutputBuffer();
    return false;
  }

  return true;
  
}

void printOutputBuffer() {
  for (int i = 0; i < atecc.countGlobal; i++) {
    Serial.print("byte(");
    Serial.print(i - 1);
    Serial.print(")");
    if (atecc.inputBuffer[i] < 0x10) { Serial.print("0"); }
    Serial.print(atecc.inputBuffer[i], HEX);
    Serial.print(" ");
    if (i % 96 == 0 && i > 0) Serial.println();
  }
}
