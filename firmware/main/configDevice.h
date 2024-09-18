#ifndef CONFIG_DEVICE_H
#define CONFIG_DEVICE_H

#include "DisplayFunctions.h"
#include <ESP8266HTTPClient.h>
#include <SparkFun_ATECCX08a_Arduino_Library.h>
#include <Wire.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>

const String BASE_URL = "http://192.168.178.23:3000/";


void setupDevice();
void setupATECC508A();
unsigned long getTime();
String buildBody(ESP8266WiFiSTAClass WiFi, unsigned long timestamp,int nonce);
bool checkRegStatus(int timeout);
#endif