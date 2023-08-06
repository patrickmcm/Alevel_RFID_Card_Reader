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

  int status = 0;
  int tries = 0;
  bool failed = false;
  int otc = 0;
  while (status != 200) {
    if (tries >= 5) {failed = true; break;}

    http.begin(client, "http://192.168.1.18:3000/v1/devices/requestotc");

    http.addHeader("Content-Type", "application/json");

    String reqBody = buildBody(WiFi,getTime(), "2555885553752669D66245EBE549B");

    status = http.POST(reqBody);

    if (status != 200 ) {
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(status).c_str());
      http.end();
      tries++;
      continue;
    }

    DynamicJsonDocument payload(1024);

    deserializeJson(payload, http.getString());

    otc = payload["otc"];

    http.end();
  }

  if(!failed) {
    registerMessage(otc);
    return;
  }

  showErrorMessage("Failed to connect to server, please try again later");
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

String buildBody(ESP8266WiFiSTAClass WiFi, unsigned long nonce, String key){
  DynamicJsonDocument doc(1024);

  unsigned long epochTime = nonce; // change

  JsonObject dataObj = doc.createNestedObject("data");
  dataObj["uid"] = WiFi.macAddress();
  dataObj["ssid"] = WiFi.SSID();
  dataObj["timestamp"] = epochTime;
  dataObj["nonce"] = epochTime;
  String jsonDoc;
  serializeJson(dataObj,jsonDoc);
  
  doc["signature"] = shaHmac(jsonDoc+nonce,key);

  String finalDoc;
  serializeJson(doc,finalDoc);

  return finalDoc;
}