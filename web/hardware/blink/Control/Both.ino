#define PHOTOCELL_PIN 0
#define LED_PIN 11

// Setup serial output
void setup() 
{
  Serial.begin( 9600 ); 
}

// Main loop
void loop() 
{
  // Read the photocell value
  int brightness;
  int reading = analogRead( PHOTOCELL_PIN ); 

  // Display reading
  Serial.print( "Analog reading = " );
  Serial.println( reading );

  // Invert reading
  // Higher brightness means less light
  reading = 1023 - reading;
  
  // Map reading range to PWM range
  // May need to customize range
  brightness = map( reading, 300, 800, 0, 255 );

  // Set the brightness of the LED
  // PWM to control brightness (analog write)
  analogWrite( LED_PIN, brightness );

  // Wait for next adjustment
  delay( 100 );
}
