#ifndef WEB_SOCKETS_H
#define WEB_SOCKETS_H

#include <WebSocketsClient.h>

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length);
void setupWebSockets();
#endif