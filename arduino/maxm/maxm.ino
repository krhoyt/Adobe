// Product reference and details
// http://thingm.com/products/blinkm-maxm.html
// MaxM d on A4
// MaxM c on A5

// Libraries
#include "Wire.h"
#include "BlinkM_funcs.h"

// MaxM I2C address
#define MAXM_ADDR 0x00

// Setup
void setup()
{
  // External serial communication
  Serial.begin( 9600 );
  
  // Fire up the MaxM
  // Do not run start script
  // Start with LED off
  BlinkM_beginWithPower();
  BlinkM_stopScript( MAXM_ADDR );
  BlinkM_setRGB( MAXM_ADDR, 0, 0, 0 );
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

      // Have the MaxM fade to the new color
      BlinkM_fadeToRGB( MAXM_ADDR, red, green, blue );   
    }
  }
}
