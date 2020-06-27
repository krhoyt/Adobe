// Product reference and details
// http://thingm.com/products/blinkm.html
// BlinkM - on A2
// BlinkM + on A3
// BlinkM d on A4
// BlinkM c on A5

// Libraries
#include "BlinkM_funcs.h"
#include "Wire.h"
 
// BlinkM I2C address
#define BLINKM_ADDR 0x09
 
// Setup
void setup()
{
  // External serial communication
  Serial.begin( 9600 );   
  
  // Fire up BlinkM
  // Do not run start script
  // Start with LED off
  BlinkM_beginWithPower();
  BlinkM_stopScript( 0x00 );
  BlinkM_setRGB( 0x00, 0, 0, 0 );
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
  while( Serial.available() > 0 ) 
  {
    // Parse out color values
    red = Serial.parseInt(); 
    green = Serial.parseInt(); 
    blue = Serial.parseInt(); 

    // Newline is end of string
    if( Serial.read() == '\n' ) 
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

