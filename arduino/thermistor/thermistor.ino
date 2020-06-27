// http://arduino.cc/playground/ComponentLib/Thermistor2
// Math used for forumula temperature calculation
#include <math.h>

// Thermistor pin
const int THERMISTOR = 0;

// Setup serial communication
void setup() 
{
  Serial.begin( 9600 );
}

// Infinite loop
void loop() 
{
  double temperature = 0;
  
  // Get temperature using custom function
  // Send value to the serial port
  temperature = thermister( analogRead( THERMISTOR ) );
  Serial.println( temperature );

  // Wait for next sample
  delay( 500 );
}

// Called to calculate temperature
double thermister( int analog ) 
{
  double temp = 0;
 
  temp = log( ( ( 10240000 / analog ) - 10000 ) );
  temp = 1 / ( 0.001129148 + ( 0.000234125 + ( 0.0000000876741 * temp * temp ) ) * temp );
  temp = temp - 273.15;
  temp = ( temp * 9.0 ) / 5 + 32.0;
 
  return temp;
}
