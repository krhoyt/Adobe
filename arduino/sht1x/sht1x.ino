// Original library from John Oxer
// https://github.com/practicalarduino/SHT1x
#include <SHT1x.h>

// Digital clock and data pins
// Other two pins needed are ground and power
const int DATA = 10;
const int CLOCK = 11;

// Instantiate a reference to the sensor
SHT1x sht1x( DATA, CLOCK );

// Setup serial communications
void setup()
{
   Serial.begin( 9600 );
}

// Infinite loop
void loop()
{
  float temperature = 0;
  float humidity = 0;

  // Read the temperature and humidity
  // There is also a Celcius method call
  // These calls take some time
  temperature = sht1x.readTemperatureF();
  humidity = sht1x.readHumidity();
  
  // Send the values to the serial port
  // Comma-separated values parsed on client
  Serial.print( temperature );
  Serial.print( "," );
  Serial.println( humidity );

  // Slight delay before sending the next values
  delay( 500 );
}

