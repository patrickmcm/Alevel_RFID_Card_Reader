#include "configDevice.h"

ATECCX08A atecc;

void setupATECC508A() {
  Wire.begin();

  if (atecc.begin() == true) {
    Serial.println("Device connected");
  } else {
    Serial.println("Error while connecting to crypto IC");
    showErrorMessage(CRYPTO_IC_DC);
    delay(10000000000000);
  }
}

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
    if (tries == 5) {
      failed = true;
      break;
    }
    displayRegisterServer(tries);
    Serial.println(tries);
    delay(1000);

    http.begin(client, BASE_URL + "v1/devices/requestotc");

    http.addHeader("Content-Type", "application/json");

    int nonce = atecc.getRandomInt();
    Serial.println("Nonce: ");
    Serial.print(nonce);
    String reqBody = buildBody(WiFi, getTime(), nonce);

    status = http.POST(reqBody);


    if (checkRegStatus(1000)) {
      break;
      registered = true;
    }
    if (status != 200) {
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(status).c_str());
      http.end();
      tries = tries + 1;
      continue;
    }

    DynamicJsonDocument payload(1024);

    deserializeJson(payload, http.getString());

    otc = payload["otc"];

    http.end();
  }

  if (registered) { return; }

  if (!failed) {
    registerMessage(otc);
    if (!checkRegStatus(600000)) {
      setupDevice();
    }
    return;
  }

  Serial.println("Failed fully");
  Serial.print("Free memory: ");
  Serial.println(ESP.getFreeHeap());
  showErrorMessage(HTTP_REG_FAIL);
}

// this function checks for the amount if time in timout, not every x seconds
bool checkRegStatus(int timeout) {
  WiFiClient client;
  ESP8266WiFiSTAClass WiFi;
  HTTPClient http;

  bool registered = false;
  unsigned long intialMillis = millis();
  int tries = 0;

  while (!registered && (millis() - intialMillis < timeout)) {
    http.begin(client, BASE_URL + "v1/devices/regStatus?uid=" + WiFi.macAddress());
    int status = http.GET();

    if (tries > 5) { break; }
    if (status != 200) {
      tries++;
      continue;
    }

    DynamicJsonDocument regStatBody(1024);

    deserializeJson(regStatBody, http.getString());

    if (regStatBody["registered"]) {
      registered = true;
      break;
    }

    http.end();
    delay(1000);
  }

  if (!registered) {
    return false;
  }

  return true;
}


unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    //Serial.println("Failed to obtain time");
    return (0);
  }
  time(&now);
  return now;
}

String buildBody(ESP8266WiFiSTAClass WiFi, unsigned long timestamp, int nonce) {
  DynamicJsonDocument doc(1024);

  unsigned long epochTime = timestamp;  // change

  JsonObject dataObj = doc.createNestedObject("data");
  dataObj["uid"] = WiFi.macAddress();
  dataObj["ssid"] = WiFi.SSID();
  dataObj["timestamp"] = epochTime;
  dataObj["nonce"] = nonce;
  String jsonDoc;
  serializeJson(dataObj, jsonDoc);
  Serial.println(jsonDoc);

  // need here to convert jsonDoc into a uint8_t byte array for jsonDocBytes
  uint8_t jsonDocBytes[jsonDoc.length()];
  jsonDoc.getBytes(jsonDocBytes, jsonDoc.length() + 1);

  uint8_t jsonInternalHash[32];
  atecc.hmac(jsonDocBytes, sizeof(jsonDocBytes), 0x000, jsonInternalHash);

  // BELOW IS: debugging for outputting the hmac result
  // if (atecc.hmac(jsonDocBytes, sizeof(jsonDocBytes), 0x000, jsonInternalHash)) {
  //   Serial.println("uint8_t jsonInternalHash[32] = {");
  //   for (int i = 0; i < sizeof(jsonInternalHash); i++) {
  //     Serial.print("0x");
  //     if ((jsonInternalHash[i] >> 4) == 0) Serial.print("0");  // print preceeding high nibble if it's zero
  //     Serial.print(jsonInternalHash[i], HEX);
  //     if (i != 31) Serial.print(", ");
  //     if ((31 - i) % 16 == 0) Serial.println();
  //   }
  //   Serial.println("};");
  // } else {
  //   Serial.println("Failed hmac of message");
  //   Serial.println("uint8_t inputBuffer[32] = {");
  //   for (int i = 0; i < sizeof(atecc.inputBuffer); i++) {
  //     Serial.print("0x");
  //     if ((atecc.inputBuffer[i] >> 4) == 0) Serial.print("0");  // print preceeding high nibble if it's zero
  //     Serial.print(atecc.inputBuffer[i], HEX);
  //     if (i != 31) Serial.print(", ");
  //     if ((31 - i) % 16 == 0) Serial.println();
  //   }
  //   Serial.println("};");
  // }

  String signature = "";
  for (int i = 0; i < sizeof(jsonInternalHash); i++) {
    if ((jsonInternalHash[i] >> 4) == 0) {
      signature += "0"; // append preceeding high nibble if it's zero
    }
    signature += String(jsonInternalHash[i], HEX);
  }

  doc["signature"] = signature;


  String finalDoc;
  serializeJson(doc, finalDoc);

  return finalDoc;
}