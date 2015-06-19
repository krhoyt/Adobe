// Externalize LED pin
int ledPin =  11;

// Called to configure the system
// Opens serial communication
// Sets the LED pin as output
void setup()   
{                
  Serial.begin( 9600 );
  pinMode( ledPin, OUTPUT );
  digitalWrite( ledPin, LOW );  
}

// Called repeatedly while running
void loop()                     
{
  // Variable to store incoming value
  int incoming = 0;

  // If there is data on the serial input
  if( Serial.available() > 0 )
  {
    // Read a byte of the serial input
    // 0 (ASCII) == 48 (int)
    // 1 (ASCII) == 49 (int)
    incoming = Serial.read();
    
    // If zero then turn the LED off
    // Anything else will turn the LED on
    if( incoming == 48 )
    {
      digitalWrite( ledPin, LOW );    
    } else {  
      digitalWrite( ledPin, HIGH );
    }
    
    // Echo the read value 
    // Helpful for debugging
    Serial.println( incoming );
  }

  // Wait 100 milliseconds before the next loop
  delay( 100 );               
}
