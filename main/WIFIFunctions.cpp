#include "WIFIFunctions.h"


const byte DNS_PORT = 53;
IPAddress apIP(192, 168, 4, 1);
DNSServer dnsServer;
ESP8266WebServer webServer(80);

bool attemptConnect = false;
bool serverOn = true;
char ssid[33] = "";
char password[65] = "";

String responseMainHTML = ""
                      "<!DOCTYPE html><html lang='en'><head>"
                      "<meta name='viewport' content='width=device-width'>"
                      "<title>CaptivePortal</title></head><body>";

void setupWifi() {
  loadFromEEPROM();

  bool connected = false;
  for (int tries = 0; tries < 3; tries++){
    WiFi.begin(ssid, password);
    int result = WiFi.waitForConnectResult();
    if (result == WL_CONNECTED) {
      connected = true;
      break;
    }
  }

  if (!connected) {
    configWifi();
  }


  Serial.print("Connected, IP address: ");
  Serial.println(WiFi.localIP());
}

void configWifi() {
  WiFi.mode(WIFI_AP_STA);
  WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
  if (WiFi.softAP("ESP8226")) {
    Serial.println("Ready");
    Serial.println(WiFi.softAPIP());
  }

  dnsServer.start(DNS_PORT, "*", apIP);

  responseMainHTML += "<label for='networks'>WLAN list (refresh if any missing)</label>"
                  "<h3>* = Password needed</h3>"
                  "<form method='POST' action='wifisave'><h4>Connect to network:</h4>"
                  "<select name=\"n\" id=\"networks\">";
  int nNetworks = WiFi.scanNetworks();
  if (nNetworks > 0) {
    for (int i = 0; i < nNetworks; i++) { responseMainHTML += "<option value="+WiFi.SSID(i)+">" + WiFi.SSID(i) + ((WiFi.encryptionType(i) == ENC_TYPE_NONE) ? F(" ") : F(" *")) + F(" (") + WiFi.RSSI(i) + F(")</option>"); }
  } else {
    responseMainHTML += F("<h1>No WLAN found</h1>>");
  }

  responseMainHTML += F("</select>"
                    "<form method='POST' action='wifisave'>"
                    "<br /><input type='password' placeholder='password' name='p'/>"
                    "<br /><input type='submit' value='Connect/Disconnect'/></form>"
                    "</body></html>");

  webServer.on("/wifisave", []() {
      webServer.arg("n").toCharArray(ssid, sizeof(ssid) - 1);
      webServer.arg("p").toCharArray(password, sizeof(password) - 1);
      webServer.sendHeader("Location", "wifi", true);
      webServer.sendHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      webServer.sendHeader("Pragma", "no-cache");
      webServer.sendHeader("Expires", "-1");
      webServer.send(200, "text/html", wifiConnect());
      webServer.client().stop();
    });
  webServer.onNotFound([]() {
      webServer.send(200, "text/html", responseMainHTML);
      webServer.client().stop();
  });

  webServer.begin();



  setupWifiMessage();
  while (serverOn) {
    // handle next request
    dnsServer.processNextRequest();
    webServer.handleClient();
  }


  // disable AP here and turn off webServer.
  WiFi.softAPdisconnect(true);
  webServer.close();
}


String wifiConnect() {
  Serial.println(ssid);
  Serial.println(password);
  WiFi.disconnect();
  WiFi.begin(ssid, password);
  int connRes = WiFi.waitForConnectResult();
  String responseResultHTML = ""
                      "<!DOCTYPE html><html lang='en'><head>"
                      "<meta name='viewport' content='width=device-width'>"
                      "<title>CaptivePortal</title></head><body>";

  switch (connRes){
    case (WL_CONNECTED):
      // save to eeprom logic
      saveToEEPROM();
      serverOn = false;
      return responseResultHTML += "<h1>Connected to "+ String(ssid) +"!</h1></br><h3>You can close this now</h3></body></html>";
      break;
    case (WL_CONNECT_FAILED):
    case (WL_WRONG_PASSWORD):
      return responseResultHTML += "<h1>Password Inncorrect</h1></br><a href=\"/\">Click here to return</a></body></html>";
      break;
    default:
      return responseResultHTML += "<h1>Error "+ String(connRes) +"</h1><a href=\"/\">Click here to return</a></body></html></body></html>";
  }
}

void saveToEEPROM() {
  EEPROM.begin(512);
  EEPROM.put(1,ssid);
  EEPROM.put(1+sizeof(ssid), password);
  char ok[2 + 1] = "OK";
  EEPROM.put(1+sizeof(ssid)+sizeof(password), ok);
  EEPROM.commit();
  EEPROM.end();
}

void loadFromEEPROM() {
  EEPROM.begin(512);
  EEPROM.get(1,ssid);
  EEPROM.get(1+sizeof(ssid),password);
  char ok[2+1];
  EEPROM.get(1+sizeof(ssid)+sizeof(password),ok);
  EEPROM.end();
  if(String(ok) != String("OK")){
    ssid[0] = 0;
    password[0] = 0;
  }
}
