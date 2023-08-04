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
  HTTPClient http;


  http.begin(client, "http://192.168.137.1:3000/v1/devices/requestotc");
  http.addHeader("Content-Type", "application/json"); 
  

  
  DynamicJsonDocument doc(1024);

  unsigned long epochTime = getTime();
  unsigned long nonce = epochTime; // placeholder

  JsonObject dataObj = doc.createNestedObject("data");
  dataObj["uid"] = WiFi.macAddress();
  dataObj["ssid"] = WiFi.SSID();
  dataObj["timestamp"] = epochTime;
  dataObj["nonce"] = epochTime;
  String jsonDoc;
  serializeJson(dataObj,jsonDoc);
  
  doc["signature"] = shaHmac(jsonDoc+nonce,"2555885553752669D66245EBE549B");

  String finalDoc;
  serializeJson(doc,finalDoc);


  int status = http.POST(finalDoc);
  Serial.println(status);
  if (status < 0 ) {
    Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(status).c_str());

  }
  
  /*  
  unsigned long lastMillis = millis();
  while (status != 200) {
    if ((millis() - lastMillis) < 2000) { continue; }
    status = http.POST(jsonDoc);
    lastMillis = millis();
  }

  */

  DynamicJsonDocument payload(1024);

  deserializeJson(payload, http.getString());

  Serial.println(http.getString());

  http.end();

  registerMessage(payload["otc"]);
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
  sha256.update(dataChars, strlen(dataChars));
  sha256.finalizeHMAC(keyChars, strlen(keyChars), result, sizeof(result));

  char hash[65]; // 2 characters per byte + 1 for null terminator

  // Convert the byte array to a hexadecimal string
  for (int i = 0; i < 32; i++) {
    sprintf(&hash[i * 2], "%02x", result[i]);
  }
  hash[64] = '\0'; // Null-terminate the string

  return String(hash);
}