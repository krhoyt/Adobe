// Original reference from Arduino tutorial
// http://arduino.cc/en/Tutorial/ReadASCIIString

// Pin constants
const int RED = 11;
const int GREEN = 10;
const int BLUE = 9;

// Setup serial and pins
void setup() 
{
  // Serial communications
  Serial.begin( 9600 );

  // Pin modes
  pinMode( RED, OUTPUT ); 
  pinMode( GREEN, OUTPUT ); 
  pinMode( BLUE, OUTPUT ); 
}

// Infinite loop in the house!
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

      // Send the values to their respective pins
      analogWrite( RED, red );
      analogWrite( GREEN, green );
      analogWrite( BLUE, blue );
    }
  }
}
