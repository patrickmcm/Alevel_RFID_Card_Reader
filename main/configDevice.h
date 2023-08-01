#ifndef CONFIG_DEVICE_H
#define CONFIG_DEVICE_H

#include "DisplayFunctions.h"
#include <Crypto.h>
#include <SHA256.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

void setupDevice();
unsigned long getTime();
String shaHmac(String data, String key);
#endif