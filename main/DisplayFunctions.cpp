#include "DisplayFunctions.h"

#define TFT_DC D1
#define TFT_CS D4
#define TFT_RST D2

Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC, TFT_RST);

void setupDisplay() {
  tft.begin();
  tft.setRotation(1);
}

void showDataOnDisplay(String uid, uint8_t size) {

  tft.fillScreen(ILI9341_BLACK);
  tft.setCursor(0, 0);
  tft.setTextColor(ILI9341_WHITE);
  tft.setTextSize(size);
  tft.println(uid);
}

void registerMessage(int otc) {
  tft.fillScreen(ILI9341_BLACK);
  tft.setTextColor(ILI9341_WHITE);

  tft.setCursor(124, 20);
  tft.setTextSize(3);
  tft.println("Vist");
  tft.setCursor(46, 60);
  tft.setTextSize(2);
  tft.println("domain.com/register");
  tft.setCursor(46, 65);
  tft.println("___________________");
  tft.setTextSize(5);
  tft.setCursor(70, 100);
  tft.print(otc);
}

void displayStartupConnection() {
  tft.fillScreen(ILI9341_BLACK);
  tft.setTextColor(ILI9341_WHITE);

  tft.setCursor(43,90);
  tft.setTextSize(3);
  tft.println("Connecting to");
  tft.setCursor(106, 126);
  tft.println("WiFi...");
}

void displayRegisterServer() {
  tft.fillScreen(ILI9341_BLACK);
  tft.setTextColor(ILI9341_WHITE);

  tft.setCursor(16,90);
  tft.setTextSize(3);
  tft.println("Registering with");
  tft.setCursor(79, 126);
  tft.println("server...");
}

void setupWifiMessage() {
  tft.fillScreen(ILI9341_BLACK);
  tft.setTextColor(ILI9341_WHITE);

  tft.setCursor(25, 90);
  tft.setTextSize(3);
  tft.println("Connect to this");
  tft.setCursor(43, 126);
  tft.println("device's WiFi");
}

void showErrorMessage(String errMsg) {
  tft.fillScreen(ILI9341_RED);
  tft.setTextColor(ILI9341_WHITE);

  tft.setCursor(0, (240-(8))/2);
  tft.setTextSize(2);
  tft.println(errMsg);
} 