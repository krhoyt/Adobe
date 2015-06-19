// Externalize the photocell pin
int photocellPin = 0;

// Setup the serial output
void setup() 
{
  Serial.begin( 9600 );   
}
 
void loop() 
{
  // Get the analog value from the pin
  int photocellReading = analogRead( photocellPin );  
 
  // Display the analog value over serial
  Serial.print( "Analog reading = " );
  Serial.println( photocellReading );
 
  // Wait a second before sampling again
  delay( 1000 );
}
