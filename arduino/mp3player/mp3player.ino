#include <SPI.h>

#include <SdFat.h>
#include <SdFatUtil.h>

#include <SFEMP3Shield.h>

SdFat sd;
SFEMP3Shield MP3player;

void setup() 
{
  uint8_t result;

  Serial.begin( 9600 );

  // SD card
  if( !sd.begin( SD_SEL, SPI_HALF_SPEED ) )
  {
    sd.initErrorHalt();
  }
  
  if( !sd.chdir( "/" ) )
  { 
    sd.errorHalt( "sd.chdir" );
  }
  
  // MP3 player
  result = MP3player.begin();

  if( result != 0 ) 
  {
    Serial.print( F( "Error code: " ) );
    Serial.print( result );
    Serial.println( F( " when trying to start MP3 player." ) );
    
    if( result == 6 ) 
    {
      Serial.println( F( "Warning: patch file not found, skipping." ) );
    }
  }
}

void loop() 
{
  uint8_t result;  
  int     incoming;
  
  // Check for serial data
  if( Serial.available() )
  {
    // Read available serial data
    incoming = Serial.read();
    
    // Play specified track
    // Convert ASCII to integer
    result = MP3player.playTrack( incoming - 48 );

    // Debug play errors
    if( result != 0 ) 
    {
      Serial.print( F( "Error code: " ) );
      Serial.print( result );
      Serial.println( F( " when trying to play track." ) );
    }
  }   
  
  // Delay for next iteration
  delay( 100 );
}


