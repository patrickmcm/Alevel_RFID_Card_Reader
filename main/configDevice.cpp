#include "configDevice.h"

SHA256 sha256;

const String BASE_URL = "http://192.168.178.23:3000/";

void setupDevice() {

  WiFiClient client;
  ESP8266WiFiSTAClass WiFi;
  HTTPClient http;
  /*
  get code from http server but for now

  STEPS:
    - private key will be written to device at factory so server already knows public, mac used to assosiciate to public key
    - create JSON struct of: mac, SSID name, public IP 
    - sign using Ed25519 with private key, do i need the ATECC508A??
    - add to struct then send to server
    - server checks with public key
  */

  int status = 0;
  int tries = 0;
  bool failed = false;
  bool registered = false;
  int otc = 0;
  while (status != 200) {
    if (tries >= 5) {failed = true; break;}
    delay(1000);

    http.begin(client, BASE_URL +"v1/devices/requestotc");

    http.addHeader("Content-Type", "application/json");

    String reqBody = buildBody(WiFi,getTime(), "2555885553752669D66245EBE549B");

    status = http.POST(reqBody);

    
    if(checkRegStatus(1000)) { break; registered = true;}
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

  if(registered) { return; }

  if(!failed) {
    if(!checkRegStatus(600000)) {
      setupDevice();
    }
    registerMessage(otc);
    return;
  }

  showErrorMessage("[63] ERR Failed to connect to server. Restart.");
  delay(10000000000000000);
}

bool checkRegStatus(int timeout){
  WiFiClient client;
  ESP8266WiFiSTAClass WiFi;
  HTTPClient http;

  bool registered = false;
  unsigned long intialMillis = millis();
  int tries = 0;

  while (!registered && (millis() - intialMillis < timeout)) {
    http.begin(client, BASE_URL+"v1/devices/regStatus?uid="+WiFi.macAddress());
    int status = http.GET();

    if(tries > 5) { break; }
    if(status != 200) { tries++; continue; }

    DynamicJsonDocument regStatBody(1024);

    deserializeJson(regStatBody, http.getString());
    
    if(regStatBody["registered"]) { registered = true; break; }
    
    http.end();
  }

  if(!registered) {
    if(tries > 5) { showErrorMessage("[92] ERR Failed to connect to server."); }
    return false;
  }

  return true;
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