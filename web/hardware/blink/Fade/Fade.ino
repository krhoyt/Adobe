// Externalize the LED pin
// Keep reference to last PWM value
int ledPin = 9;
int ledValue = 0;

//Setup for serial output
void setup()  
{ 
  Serial.begin( 9600 );
} 

// Main logic called repeatedly
void loop()  
{ 
  int incoming = 0;  
  
  // If there is data on the serial input
  if( Serial.available() > 0 )
  {
    // Read a byte of the serial input
    // 0 (ASCII) == 48 (int)
    // 1 (ASCII) == 49 (int)
    incoming = Serial.read();
    
    // Map to the 255 steps of PWM
    incoming = ( 255 / 10 ) * ( incoming - 48 );
    
    // Echo the PWM value 
    // Helpful for debugging
    Serial.println( incoming );

    // If fading from lower value to larger value
    if( incoming > ledValue )
    {
      for( int fadeValue = ledValue; fadeValue <= incoming; fadeValue +=5 ) 
      { 
        analogWrite( ledPin, fadeValue );         
        delay( 30 );                           
      } 
    } else { 
      // Fading from larger value to lower value
      for( int fadeValue = ledValue; fadeValue >= incoming; fadeValue -=5 ) 
      { 
        analogWrite( ledPin, fadeValue );         
        delay( 30 );                           
      }       
    }
    
    // Store reference for next fade
    ledValue = incoming;
  }
}
