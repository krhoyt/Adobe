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
  // Null byte trigger data event
  Serial.print( temperature );
  Serial.write( ( byte )0x00 );
  
  // Wait a second
  delay( 1000 );
}
