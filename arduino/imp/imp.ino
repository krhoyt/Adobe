// Library needed to communicate with Imp
#include <SoftwareSerial.h>

// LED pin
const int LED_PIN = 13;

// Imp treated as additional serial line
// Arduino only supports one serial
// Use software to pretend there is another
SoftwareSerial imp( 8, 9 );

// Setup
void setup()  
{
  // Use designated pin as an output
  // Set to off initially
  pinMode( LED_PIN, OUTPUT );
  digitalWrite( LED_PIN, LOW );    
 
  // Echo to serial for debugging
  Serial.begin( 9600 );
  
  // Serial communication from Imp
  imp.begin( 19200 );
}

// Infinite loop
void loop()
{
  // Hold light value from Imp
  int light = 0;
  
  // Read incoming data from Imp
  // Newline terminated
  while( imp.available() > 0 ) 
  {
    // Parse out data value
    light = imp.parseInt();
    
    // Newline is end of string
    if( imp.read() == '\n' )
    {
      // Turn the LED on or off
      // Assumes sending Imp 0 or 1
      // 0 == Off
      // 1 == On
      digitalWrite( LED_PIN, light );  
    }
  }  
}

