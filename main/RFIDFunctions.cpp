#include "RFIDFunctions.h"

#define RST_PIN         0  
#define SS_PIN          2   
MFRC522 mfrc522(SS_PIN, RST_PIN); // Assuming you have defined SS_PIN and RST_PIN somewhere

void setupRFID() {
  SPI.begin();
  mfrc522.PCD_Init();
  delay(5);
  mfrc522.PCD_DumpVersionToSerial();
  Serial.println(F("Scan PICC to see UID, SAK, type, and data blocks..."));	
}

String getUID() {
  String uid;
  while (true){
    if ( ! mfrc522.PICC_IsNewCardPresent()) {
      continue;
    }

    if ( ! mfrc522.PICC_ReadCardSerial()) {
      continue;
    }

    break;
  }
  

  for (byte i = 0; i < mfrc522.uid.size; i++) {
    uid += String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    uid += String(mfrc522.uid.uidByte[i], HEX);
  }
  return uid;
}
