#include "DisplayFunctions.h"

#define TFT_DC D4
#define TFT_CS D8
#define TFT_RST D3

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

void displayRegisterServer(int attempt) {
  tft.fillScreen(ILI9341_BLACK);
  tft.setTextColor(ILI9341_WHITE);
  
  tft.setCursor(16,90);
  tft.setTextSize(3);
  tft.println("Registering with");
  tft.setCursor(79, 126);
  tft.println("server...");
  tft.setCursor(80, 170);
  tft.print("Attempt: ");
  tft.print(attempt);
  delay(1000);
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

void showErrorMessage(int err) {
  tft.fillScreen(ILI9341_RED);
  tft.setTextColor(ILI9341_WHITE);

  tft.setCursor(0, (240-(8))/2);
  tft.setTextSize(2);
  switch(err) {
    case CRYPTO_IC_DC:
      tft.print("Error [");
      tft.print(CRYPTO_IC_DC);
      tft.print("]");
      tft.println(" Failed to connect to crypto IC. Restart.");
      break;
    case HTTP_REG_FAIL:
      tft.print("Error [");
      tft.print(HTTP_REG_FAIL);
      tft.print("]");
      tft.println(" Failed to connect to web server. Check Wi-Fi.");
      break;
  }
  delay(10000000000000000);
} 