#ifndef WIFI_FUNCTIONS_H
#define WIFI_FUNCTIONS_H

#include <ESP8266WiFi.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include <EEPROM.h>
#include "config.h"
#include "DisplayFunctions.h"

void setupWifi();
void configWifi();
String wifiConnect();
void loadFromEEPROM();
void saveToEEPROM();


#endif
