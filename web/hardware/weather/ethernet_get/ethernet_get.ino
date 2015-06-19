#include <Ethernet.h>
#include <SHT1x.h>
#include <SPI.h>

#define dataPin 7
#define clockPin 6

boolean        incoming = 0;
byte           mac[] = { 0x00, 0xAA, 0xBB, 0xCC, 0xDA, 0x02 };
EthernetServer server( 80 );
SHT1x          sht1x( dataPin, clockPin );

void setup()
{
  Serial.begin( 9600 );
  Ethernet.begin( mac );
  server.begin();

  Serial.println( Ethernet.localIP() );
}

void loop()
{
  boolean        currentLineIsBlank = true;
  char           c;
  EthernetClient client = server.available();
  
  if( client ) 
  {
    Serial.println( "New client" );
    
    while( client.connected() ) 
    {
      if( client.available() ) 
      {
        c = client.read();
        Serial.write( c );
        
        if( c == '\n' && currentLineIsBlank )
        {
          client.println( "HTTP/1.1 200 OK" );
          client.println( "Content-Type: text/html" );
          client.println( "Connection: close" );
          client.println();
          
          client.println( "<html>" );
          client.println( sht1x.readTemperatureF() );
          client.println( "<br/>" );
          client.println( sht1x.readHumidity() );
          client.println( "</html>" );
          
          break;
        }  
        
        if( c == '\n' ) 
        {
          currentLineIsBlank = true;
        } else if ( c != '\r' ) {
          currentLineIsBlank = false;
        }
      }
    }

    delay( 1 );
    client.stop();
    
    Serial.println( "Client disconnected" );
  }
}
