#include "BlinkM_funcs.h"
#include "Wire.h"

int blinkm = 9;
int blue = 0;
int digit = 0;
int green = 0;
int hex = 0;
char incoming;
int place = 0;
int red = 0;
int sum = 0;
 
void setup()
{
  BlinkM_beginWithPower();
  BlinkM_stopScript( blinkm );  
  
  Serial.begin( 9600 );  
}
 
void loop()
{
  if( Serial.available() > 0 )
  {
    incoming = Serial.read();
    digit = incoming - '0';

    if( place == 0 )
    {
      sum = 100 * digit;
      place = place + 1;
    } else if( place == 1 ) {
      sum = sum + ( 10 * digit );
      place = place + 1;  
    } else {
      sum = sum + digit;      
      place = 0;
    
      if( hex == 0 )
      {
        red = sum;
        hex = hex + 1;
        
        Serial.println( red, DEC );        
      } else if( hex == 1 ) {
        green = sum;
        hex = hex + 1; 

        Serial.println( green, DEC );        
      } else {
        blue = sum; 
        hex = 0;

        BlinkM_fadeToRGB( blinkm, red, green, blue );     
        Serial.println( blue, DEC );        
      }
    }
  }  
}
