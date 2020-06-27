// Originally from:
// https://github.com/todbot/wiichuck_adapter

#include <Wire.h>
#include "nunchuck_funcs.h"

int loop_count = 0;

byte accx;
byte accy;
byte accz;
byte joyx;
byte joyy;
byte zbut;
byte cbut;

void setup()
{
  Serial.begin( 9600 );
  
  nunchuck_setpowerpins();
  nunchuck_init();
}

void loop()
{
  // Every 100 msecs get new data
  if( loop_count > 100 ) 
  { 
    loop_count = 0;
  
    nunchuck_get_data();
  
    accx  = nunchuck_accelx(); // ranges from approx 70 - 182
    accy  = nunchuck_accely(); // ranges from approx 65 - 173
    accz  = nunchuck_accelz(); // ranges from approx 0 - 255
  
    joyx = nunchuck_joyx(); // ranges from approx 30 - 232
    joyy = nunchuck_joyy(); // ranges from approx 33 - 235
    
    zbut = nunchuck_zbutton(); // 1 when pressed
    cbut = nunchuck_cbutton(); // 1 when pressed
    
    // Serial.print( "accx: " ); 
    Serial.print( ( byte )accx, DEC );
    Serial.print( "," );         
    
    // Serial.print( "accy: " ); 
    Serial.print( ( byte )accy, DEC );        
    Serial.print( "," );          
    
    // Serial.print( "accz: " ); 
    Serial.print( ( byte )accz, DEC );        
    Serial.print( "," );        
  
    // Serial.print( "joyx: " ); 
    Serial.print( ( byte )joyx, DEC );        
    Serial.print( "," );        
  
    // Serial.print( "joyy: " ); 
    Serial.print( ( byte )joyy, DEC );        
    Serial.print( "," );               
    
    // Serial.print( "zbut: " ); 
    Serial.print( ( byte )zbut, DEC );        
    Serial.print( "," );        
    
    // Serial.print( "cbut: " ); 
    Serial.println( ( byte )cbut, DEC );       
  }
  
  loop_count++;
  delay( 1 );
}

