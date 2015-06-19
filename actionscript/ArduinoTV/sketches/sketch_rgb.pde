#include "BlinkM_funcs.h"
#include "Wire.h"
 
int blinkm_addr = 9;
int blue = 0;
int green = 0;
int incoming_byte = 0;
int place = 0;
int red = 0;
 
void setup()
{
  BlinkM_beginWithPower();
  BlinkM_stopScript( blinkm_addr );
 
  Serial.begin( 9600 );  
}
 
void loop()
{
  if( Serial.available() > 0 )
  {
    incoming_byte = Serial.read();
 
    if( place == 0 )
    {
      red = incoming_byte;
      place = 1;
    } else if( place == 1 ) {
      green = incoming_byte;
      place = 2;
    } else if( place == 2 ) {
      blue = incoming_byte;
      BlinkM_fadeToRGB( blinkm_addr, red, green, blue );      
      place = 0; 
    }
  }  
}
