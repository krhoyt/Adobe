#include <SC16IS750.h>
#include <SPI.h>
#include <WebSocket.h>
#include <WiFly.h>

// Toggle debug to serial port
// #define DEBUGGING

// Number of callback functions
// Default is 1
#define CALLBACK_FUNCTIONS 1

// Define frame length 
// Default is 256
#define MAX_FRAME_LENGTH 64

#define PHOTOCELL_PIN 1

#define LED_PIN 8

// WiFly server instance
WiFlyServer server( 80 );

// Web Socket connection
WebSocket socket;

// Called when a new message from the WebSocket is received
// Looks for a message in this form:
//
// DPV
//
// Where: 
//        D is either 'd' or 'a' - digital or analog
//        P is a pin #
//        V is the value to apply to the pin

void handleClientData( String &dataString ) 
{
  if( dataString.equals( "0" ) )
  {
    digitalWrite( LED_PIN, LOW );
  } else if( dataString.equals( "1" ) ) {
    digitalWrite( LED_PIN, HIGH );
  }
  
  /*
  bool isDigital = dataString[0] == 'd';
  int pin = dataString[1] - '0';
  int value;

  value = dataString[2] - '0';
 
  pinMode( pin, OUTPUT );
   
  if( isDigital ) 
  {
    digitalWrite( pin, value );
  } else {
    analogWrite( pin, value );
  }
  */
  
  Serial.print( "Incoming: " );
  Serial.println( dataString );
}

// Send the client the analog value of a pin
void sendClientData( int pin ) 
{
  String data = "a";
  
  pinMode( pin, INPUT );
  
  data += String( pin ) + String( analogRead( pin ) );
  socket.sendData( data );  
}

void setup() 
{
  Serial.begin( 9600 );
  
  pinMode( LED_PIN, OUTPUT );
  digitalWrite( LED_PIN, LOW );   
  
  SC16IS750.begin();
  
  WiFly.setUart( &SC16IS750 ); 
  WiFly.begin();
  
  // WPA1/2 use auth 3 and also send 'set wlan phrase PASSWORD'
  // WEP use auth 2 and also send 'set wlan key KEY'
  WiFly.sendCommand( F( "set wlan auth 0" ) );
  WiFly.sendCommand( F( "set wlan channel 0" ) );
  WiFly.sendCommand( F( "set ip dhcp 1" ) );
  WiFly.sendCommand( F( "set comm remote 0" ) ); 
  
  server.begin();
  Serial.println( F( "Joining WiFi network..." ) );
  
  // Join the wireless network
  // Change to reflect network names
  if( !WiFly.sendCommand( F( "join Hoyt" ), "Associated!", 20000, false ) ) 
  {
    Serial.println( F( "Association failed." ) );
    while( 1 ) {;}
  }
  
  if( !WiFly.waitForResponse( "DHCP in", 10000 ) ) 
  {  
    Serial.println( F( "DHCP failed." ) );
    while( 1 ) {;}
  }

  // Display the IP address
  Serial.println( WiFly.localIP() );
  
  // Give WiFly time to respond
  delay( 1000 );
}

void loop() 
{
  String data;
  int    photocell;

  WiFlyClient client = server.available();
  
  if( client.connected() && socket.handshake( client ) ) 
  {  
    while( client.connected() )  
    {
      data = socket.getData();

      if( data.length() > 0 ) 
      {
        handleClientData( data );
      }

      photocell = analogRead( PHOTOCELL_PIN );
      socket.sendData( String( photocell ) );
    }
  }
  
  // Wait to let client fully disconnect
  delay( 1000 );
}
