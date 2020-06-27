// Ping for the Parallax PING
// http://www.parallax.com/tabid/768/ProductID/92/Default.aspx
// Code from Arduino tutorial
// http://arduino.cc/en/Tutorial/Ping?from=Tutorial.UltrasoundSensor
const int PING_PIN = 7;

// Setup serial communications
void setup() 
{
  Serial.begin( 9600 );
}

// Loop
void loop()
{
  long duration;
  long inches;

  // Set pin to output and low
  pinMode( PING_PIN, OUTPUT );
  digitalWrite( PING_PIN, LOW );
  
  // Pulse in a specific pattern
  // Triggers distance measurement
  delayMicroseconds( 2 );
  digitalWrite( PING_PIN, HIGH );
  delayMicroseconds( 5 );
  digitalWrite( PING_PIN, LOW );

  // Switch pin to input mode
  // Read in the data from the pin
  pinMode( PING_PIN, INPUT );
  duration = pulseIn( PING_PIN, HIGH );
  
  // Convert from microseconds to inches
  // Speed of sound is relatively constant
  inches = microsecondsToInches( duration );
 
  // Send across the serial port 
  Serial.println( inches );

  // Pause before taking the next sample
  // Select your sample rate wisely
  delay( 100 );
}

// Converts microseconds to distance in inches
long microsecondsToInches( long microseconds )
{
  return microseconds / 74 / 2;
}

