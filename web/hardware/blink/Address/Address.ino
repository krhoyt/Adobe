// Required libraries
#include <SPI.h>
#include <Ethernet.h>

// MAC address found on shield
// Instance of ethernet client for compilation
byte           mac[] = { 0x90, 0xA2, 0xDA, 0x0D, 0x24, 0x28 };
EthernetClient client;

// Configure the program
void setup() 
{
  // Allow printing information
  Serial.begin( 9600 );

  // Try to get an address using DHCP
  if( Ethernet.begin( mac ) == 0 ) 
  {
    // Fail so do nothing forever
    Serial.println( "Failed to configure Ethernet using DHCP." );
    for(;;) ;
  }
  
  // Print the IP address
  Serial.print( "IP address: " );
  Serial.println( Ethernet.localIP() );
}

// Infinite loop
// Nothing going on here
void loop() {;}
