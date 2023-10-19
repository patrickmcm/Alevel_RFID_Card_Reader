#include "configDevice.h"

ATECCX08A atecc;

void setupATECC508A(){
  Wire.begin();

  if (atecc.begin() == true) {
    Serial.println("Device connected");
  } else {
    Serial.println("Error while connecting to crypto IC");
    //showErrorMessage("[12] ERR Crypto IC not connected");
    delay(10000000000000);
  }
}

void setupDevice() {
  displayRegisterServer();

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
    
    int nonce = atecc.getRandomInt();
    String reqBody = buildBody(WiFi,getTime(),nonce);

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
    registerMessage(otc);
    if(!checkRegStatus(600000)) {
      setupDevice();
    }
    return;
  }

  showErrorMessage("[63] ERR Failed to connect to server. Restart.");
  delay(10000000000000000);
}

// this function checks for the amount if time in timout, not every x seconds
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
    delay(1000);
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

String buildBody(ESP8266WiFiSTAClass WiFi, unsigned long timestamp,int nonce){
  DynamicJsonDocument doc(1024);

  unsigned long epochTime = timestamp; // change

  JsonObject dataObj = doc.createNestedObject("data");
  dataObj["uid"] = WiFi.macAddress();
  dataObj["ssid"] = WiFi.SSID();
  dataObj["timestamp"] = epochTime;
  dataObj["nonce"] = nonce;
  String jsonDoc;
  serializeJson(dataObj,jsonDoc);

  // need here to convert jsonDoc into a uint8_t byte array for jsonDocBytes
  uint8_t jsonDocBytes[jsonDoc.length() + 1]; // +1 for the null terminator
  jsonDoc.getBytes(jsonDocBytes, jsonDoc.length() + 1);

  uint8_t jsonInternalHash[32];
  atecc.hmac(jsonDocBytes, sizeof(jsonDocBytes), 0x000, jsonInternalHash);

  String signature = "";
  for(int i = 0; i< sizeof(jsonInternalHash); i++){
    if(jsonInternalHash[i] < 0x10) {Serial.print("0");}
    Serial.print(jsonInternalHash[i],HEX);
    char hexBuffer[3]; // Two characters for the byte and one for the null terminator
    snprintf(hexBuffer, sizeof(hexBuffer), "%02X", jsonInternalHash[i]);
    signature += hexBuffer;
  }

  doc["signature"] = signature;

  String finalDoc;
  serializeJson(doc,finalDoc);

  delete[] jsonDocBytes;

  return finalDoc;
}