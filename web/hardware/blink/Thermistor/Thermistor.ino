// Include an external library
#include <Thermistor.h>

// Instantiate an instance
// Pass analog pin to use
Thermistor temp( 0 );

void setup() 
{
  Serial.begin( 9600 );
}

void loop() 
{
  // Get the temperature
  double temperature = temp.getTemp();
  
  // Display the temperature
  Serial.println( temperature );
  
  // Wait a second
  delay( 1000 );
}
