#include "configDevice.h"




void setupDevice() {
  /*
  get code from http server but for now

  STEPS:
    - private key will be written to device at factory so server already knows public, mac used to assosiciate to public key
    - create JSON struct of: mac, SSID name, public IP 
    - sign using Ed25519 with private key, do i need the ATECC508A??
    - add to struct then send to server
    - server checks with public key
  */
  int otc = 123456;
  registerMessage(otc);
  // code displayed to user, now we would wait for data from server

  


}