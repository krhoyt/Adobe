// Maxbotix sensors
// Will work for many of their sensors
// http://www.maxbotix.com/Ultrasonic_Sensors/MB1000.htm

// Digital pin used for pulse width measurement
const int SONAR_PIN = 7;

// Setup serial communication
// Setup designated pin for input
void setup()
{
  Serial.begin( 9600 );  
  pinMode( SONAR_PIN, INPUT );
}

// Loop
void loop()
{
  int inches;
  int pulse;
  
  // Pulse width representation 
  // Scale factor of 147 uS per inch
  pulse = pulseIn( SONAR_PIN, HIGH );
  inches = pulse / 147;

  // Centimeters resolution
  // cm = inches * 2.54;
  
  // Send across serial port
  Serial.println( inches );

  // Wait for next sample
  delay( 100 );
}
