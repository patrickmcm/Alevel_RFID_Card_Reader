#include "configDevice.h"

SHA256 sha256;

void setupDevice() {
  /*
  get code from http server but for now

  STEPS:
    - private key will be written to device at factory so server already knows public, mac used to assosiciate to public key
    - create JSON struct of: mac, SSID name, public IP 
    - sign using Ed25519 with private key, do i need the ATECC508A??
    - add to struct then send to server
    - server checks with public key
  */

  WiFiClient client;
  ESP8266WiFiSTAClass WiFi;


  HTTPClient().begin(client, "http://localhost:3000/v1/devices/register");

  
  DynamicJsonDocument doc(1024);

  unsigned long epochTime = getTime();
  String nonce = "fasdfasdf"

  JsonObject dataObj = doc.createNestedObject("data");
  dataObj["uid"] = WiFi.macAddress();
  dataObj["ssid"] = WiFi.SSID();
  dataObj["timestamp"] = epochTime;
  dataObj["nonce"] = nonce;
  String jsonDoc;
  serializeJson(dataObj,jsonDoc);
  doc["signature"] = shaHmac(jsonDoc+nonce,"2555885553752669D66245EBE549B");
  Serial.println();
  serializeJson(doc,Serial);
  // now just send to server


  //registerMessage(otc);
  // code displayed to user, now we would wait for data from server

  


}


unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    //Serial.println("Failed to obtain time");
    return(0);
  }
  time(&now);
  return now;
}


String shaHmac(String data, String key) {
  uint8_t result[32];
  
  // Convert the key and data to const char* before passing to strlen()
  const char* keyChars = key.c_str();
  const char* dataChars = data.c_str();

  SHA256 sha256;
  sha256.resetHMAC(keyChars, strlen(keyChars));
  sha256.update((const uint8_t*)dataChars, strlen(dataChars));
  sha256.finalizeHMAC(keyChars, strlen(keyChars), result, sizeof(result));

  String hash = "";
  for (int i = 0; i < sizeof(result); i++) {
    hash += String(result[i], HEX);
  }
  
  return hash; // Add the return statement to return the calculated hash
}