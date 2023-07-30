#include "DisplayFunctions.h"

#define TFT_DC D4
#define TFT_CS D2
#define TFT_RST D3

Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC, TFT_RST);

void setupDisplay() {
  tft.begin();
  tft.setRotation(3);
}

void showDataOnDisplay(String uid) {
  // Display the data on the OLED
  // You can use the buffer_to_hex_string and display functions from the previous examples
  tft.fillScreen(ILI9341_BLACK);
  tft.setCursor(0, 0);
  tft.setTextColor(ILI9341_WHITE);
  tft.setTextSize(5);
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

void setupWifiMessage() {
  tft.fillScreen(ILI9341_BLACK);
  tft.setTextColor(ILI9341_WHITE);

  tft.setCursor(75, 94);
  tft.setTextSize(2);
  tft.println("Connect to this");
  tft.setCursor(82, 112);
  tft.println("device's WiFi");
}
