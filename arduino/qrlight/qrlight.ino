// Libraries
#include "BlinkM_funcs.h"
#include <SoftwareSerial.h>
#include "Wire.h"
 
// BlinkM I2C address
#define BLINKM_ADDR 0x09

// Imp treated as additional serial line
// Arduino only supports one serial
// Use software to pretend there is another
SoftwareSerial imp( 8, 9 );
 
// Setup
void setup()
{
  // External serial communication
  Serial.begin( 9600 );
  
  // Serial communication from Imp
  imp.begin( 19200 );
  
  // Fire up MaxM Master
  // Do not run start script
  // Start with RGB LED strip off
  BlinkM_beginWithPower();
  BlinkM_stopScript( BLINKM_ADDR );
  BlinkM_setRGB( BLINKM_ADDR, 0, 0, 0 );
}
 
// Infinite loop 
void loop()
{
  // Hold color values
  int blue = 0;
  int green = 0;
  int red = 0;
  
  // Read incoming RGB string
  // Comma-delimited
  while( imp.available() > 0 ) 
  {
    // Parse out color values
    blue = imp.parseInt(); 
    green = imp.parseInt(); 
    red = imp.parseInt(); 

    // Newline is end of string
    if( imp.read() == '\n' ) 
    {
      // Make sure the color values fit RGB values
      red = constrain( red, 0, 255 );
      green = constrain( green, 0, 255 );
      blue = constrain( blue, 0, 255 );

      // Have the BlinkM fade to the new color
      BlinkM_fadeToRGB( BLINKM_ADDR, red, green, blue );   
    }
  }
}

