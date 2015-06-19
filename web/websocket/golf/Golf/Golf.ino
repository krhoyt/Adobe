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

// WiFly server instance
WiFlyServer server( 80 );

// Web Socket connection
WebSocket socket;

int CS_pin = 3;
int DIO_pin = 6;
int CLK_pin = 5;

byte tempLSB = 0;
byte tempMSB = 0;

int aX = 0;
int aY = 0;
int aZ = 0;

void setup() 
{
  Serial.begin( 9600 );
  
  pinMode( CS_pin, OUTPUT );
  pinMode( CLK_pin, OUTPUT );
  pinMode( DIO_pin, OUTPUT );

  digitalWrite( CS_pin, LOW );
  digitalWrite( CLK_pin, LOW );
  
  delayMicroseconds( 1 );
  
  digitalWrite( CS_pin, HIGH );
  digitalWrite( CLK_pin, HIGH );
  
  SC16IS750.begin();
  
  WiFly.setUart( &SC16IS750 ); 
  WiFly.begin();
  
  // WPA1/2 use auth 3 and also send 'set wlan phrase PASSWORD'
  // WEP use auth 2 and also send 'set wlan key KEY'
  WiFly.sendCommand( F( "set wlan auth 3" ) );
  WiFly.sendCommand( F( "set wlan phrase Paige123" ) );
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
  delay( 500 );  
}

void loop() 
{
  String data;
  
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

      int normX = 2048 - GetValue( B1000 );
      int normY = 2048 - GetValue( B1001 );  
      int normZ = 2048 - GetValue( B1010 );

      socket.sendData( String( normX ) + "," + String( normY ) + "," + String( normZ ) );
    }
  }
  
  // Wait to let client fully disconnect
  delay( 1000 );  
}

void StartMassurement() 
{
  pinMode( DIO_pin, OUTPUT );
  
  digitalWrite( CS_pin, LOW );
  digitalWrite( CLK_pin, LOW );
  
  delayMicroseconds( 1 );

  digitalWrite( DIO_pin, HIGH );
  digitalWrite( CLK_pin, HIGH );

  delayMicroseconds( 1 );
}

void ShiftOutNibble( byte DataOutNibble ) 
{
  for( int i = 3; i >= 0; i-- ) 
  {
    digitalWrite( CLK_pin, LOW );

    if( ( DataOutNibble & ( 1 << i ) ) == ( 1 << i ) ) 
    {
      digitalWrite( DIO_pin, HIGH );
    } else {
      digitalWrite( DIO_pin, LOW );
    }
    
    digitalWrite( CLK_pin, HIGH );
    delayMicroseconds( 1 );
  }
}

void SampleIt() 
{
  digitalWrite( CLK_pin, LOW );
  delayMicroseconds( 1 );
  digitalWrite( CLK_pin, HIGH );
  delayMicroseconds( 1 );

  pinMode( DIO_pin, INPUT );
  digitalWrite( CLK_pin, LOW );
  delayMicroseconds( 1 );
  digitalWrite( CLK_pin, HIGH );
}

byte ShiftInNibble() 
{
  byte resultNibble;

  resultNibble = 0;

  for( int i = 3 ; i >= 0; i-- ) 
  {
    digitalWrite( CLK_pin, LOW );
    delayMicroseconds( 1 );

    if( digitalRead( DIO_pin ) == HIGH ) 
    {
      resultNibble += 1 << i;
    } else {
      resultNibble += 0 << i;
    }
	
    digitalWrite( CLK_pin, HIGH );
  }

  return resultNibble;
}

void EndMessurement() 
{
  digitalWrite( CS_pin, HIGH );
  digitalWrite( CLK_pin, HIGH );
}

int GetValue( byte Axis ) 
{
  int Result = 0;
  
  StartMassurement();
  ShiftOutNibble( Axis );
  SampleIt();
  Result =  ( ShiftInNibble() << 8 ) + ( ShiftInNibble() << 4 ) + ShiftInNibble();
  EndMessurement();

  return Result;
}

void handleClientData( String &dataString ) 
{
  if( dataString.equals( "0" ) )
  {
    // digitalWrite( LED_PIN, LOW );
  } else if( dataString.equals( "1" ) ) {
    // digitalWrite( LED_PIN, HIGH );
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
