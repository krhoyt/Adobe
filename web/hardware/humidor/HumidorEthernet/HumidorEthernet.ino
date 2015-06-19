#include <Ethernet.h>
#include <SHT1x.h>
#include <SPI.h>

// For SHT15
#define CLOCK_PIN 6
#define DATA_PIN 7

// Networking
byte   mac[] = {0x90, 0xA2, 0xDA, 0x0D, 0x24, 0x28};
char   domain[] = "api.thingspeak.com";
String key = "3O1D1RNNBD2TFQSQ";
long   interval = 30 * 1000;

// Tracking connections
long    lastTime = 0; 
boolean lastConnected = false;
int     failCounter = 0;

// Sheilds
EthernetClient client;
SHT1x          sht( DATA_PIN, CLOCK_PIN );

// Setup
void setup()
{
  // Serial 
  Serial.begin( 9600 );
  
  // Internet
  startEthernet();
}

// Loop
void loop()
{
  // HTTP response
  char   c;
  
  // Sensor values
  String humidity;
  String temperature;
  
  // Read response
  if( client.available() )
  {
    c = client.read();
    Serial.print( c );
  }

  // Disconnect after sending data
  if( !client.connected() && lastConnected )
  {
    Serial.println( "...disconnected." );
    Serial.println();
    
    client.stop();
  }
  
  // Update the feed data
  if( !client.connected() && ( millis() - lastTime > interval ) )
  {
    temperature = String( sht.readTemperatureF() );    
    humidity = String( sht.readHumidity() );
    
    updateThingSpeak( "field1=" + temperature + "&field2=" + humidity );
  }
  
  // Reset ethernet after too many failures
  if( failCounter > 3 ) 
  {
    startEthernet();
  }
  
  // Wait for next update
  lastConnected = client.connected();
}

// Update data feed
void updateThingSpeak( String data )
{
  // Connect to ThingSpeak
  if( client.connect( domain, 80 ) )
  {         
    // Print HTTP data
    client.print( "POST /update HTTP/1.1\n" );
    client.print( "Host: api.thingspeak.com\n" );
    client.print( "Connection: close\n" );
    client.print( "X-THINGSPEAKAPIKEY: " + key + "\n" );
    client.print( "Content-Type: application/x-www-form-urlencoded\n" );
    client.print( "Content-Length: " );
    client.print( data.length() );
    client.print( "\n\n" );

    client.print( data );
    
    // Record last update
    lastTime = millis();
    
    // Update connection attempts
    if( client.connected() )
    {
      Serial.println( "Connecting to ThingSpeak..." );
      Serial.println();
      
      failCounter = 0;
    } else {
      failCounter++;
  
      Serial.println( "Connection to ThingSpeak failed (" + String( failCounter ) + ")" );   
      Serial.println();
    }    
  } else {
    failCounter++;
    
    Serial.println( "Connection to ThingSpeak Failed (" + String( failCounter ) + ")" );   
    Serial.println();
    
    lastTime = millis(); 
  }
}

// Internet
void startEthernet()
{  
  // Stop if running
  client.stop();

  Serial.println( "Connecting Arduino to network..." );
  Serial.println();  

  // Let reset occur
  delay( 1000 );
  
  // Attempt connection to network
  if( Ethernet.begin( mac ) == 0 )
  {
    Serial.println( "DHCP Failed, reset Arduino to try again." );
    Serial.println();
  } else {
    Serial.println( "Arduino connected to network using DHCP." );
    Serial.println();
  }
 
  // Wait a second before moving on 
  delay( 1000 );
}
