// Libraries
#include <SC16IS750.h>
#include <SHT1x.h>
#include <SPI.h>
#include <WiFly.h>

// Constants (for sensor)
#define dataPin  7
#define clockPin 6

// Wireless connectivity
boolean     lastConnected = false;
long        lastConnectionTime = 0; 
WiFlyClient client = WiFlyClient();

// Sensor
SHT1x       sht1x( dataPin, clockPin );

// Setup the sensor and wireless
// Happens only once
void setup() 
{  
  // Access to serial output (debugging)
  Serial.begin( 9600 );
  
  // SPI-USART bridge
  // Start wireless chip
  SC16IS750.begin();
  WiFly.setUart( &SC16IS750 );
  WiFly.begin();
  
  // Setup wireless chip for given network
  // WPA, password, DHCP
  WiFly.sendCommand( F( "set comm remote 0" ) );  
  WiFly.sendCommand( F( "set wlan auth 0" ) );
  // WiFly.sendCommand( F( "set wlan phrase htmlflash" ) );  
  WiFly.sendCommand( F( "set wlan channel 0" ) );
  WiFly.sendCommand( F( "set ip dhcp 1" ) );
  
  // Get on the wireless network
  if( !WiFly.sendCommand( F( "join Adobe" ), "Associated!", 20000, false ) ) 
  {
    // You lose
    Serial.println( "Association failed." );
    while( 1 ) {;}
  }
  
  // Get an IP address
  if( !WiFly.waitForResponse("DHCP in", 10000 ) ) 
  {
    // You lose
    Serial.println( "DHCP failed." );
    while( 1 ) {;}
  }
  
  // Display board IP address (debugging)
  Serial.println( WiFly.localIP() );
}

// Loop forever
void loop() 
{
  // Variables
  char   c;
  String content;  
  String humidity;  
  String temperature;

  // If data is coming from the network
  // Read and print it (debugging)
  if( client.available() )
  {
    c = client.read();
    // Serial.print( c );
  }
  
  // If the remote server has closed the connection
  // Example: End of an HTTP request
  // Close our side too
  if( !client.connected() && lastConnected )
  {
    // Serial.println( "Disconnected." );    
    client.stop();
  }
  
  // If we are not connected to a remote server
  // And our sampling time has elapsed
  if( !client.connected() && ( ( millis() - lastConnectionTime ) > 30000 ) )
  {
    // Get the sensor data and concatenate for HTTP POST
    temperature = String( sht1x.readTemperatureF() );
    humidity = String( sht1x.readHumidity() );
    content = "field1=" + temperature + "&field2=" + humidity;

    // Show sensor values (debugging)
    Serial.println( temperature + "/" + humidity );      
    
    // If we can connect to the remote server
    // Send an HTTP POST containing the sensor data
    if( client.connect( "api.thingspeak.com", 80 ) )
    { 
      // Connection to the remote server has been made (debuggin)
      // Serial.println( "Connected." );
        
      // HTTP POST containing sensor data  
      client.print( "POST /update HTTP/1.1\n" );
      client.print( "Host: api.thingspeak.com\n" );
      client.print( "Connection: close\n" );
      client.print( "X-THINGSPEAKAPIKEY: 3O1D1RNNBD2TFQSQ\n" );
      client.print( "Content-Type: application/x-www-form-urlencoded\n" );
      client.print( "Content-Length: " );
      client.print( content.length() );
      client.print( "\n\n" );
      client.print( content );
      client.print( "\n" );
    
      // Note the time we last made a connection
      lastConnectionTime = millis();
    }
  }
  
  // Monitor if the remote server connection is still open
  lastConnected = client.connected();
}
