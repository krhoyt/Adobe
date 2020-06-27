// Using: https://github.com/ringerc/Arduino-DHT22
// Alternative: http://playground.arduino.cc/Main/DHTLib
#include <DHT22.h>

// Data pin for the DHT22
// Connect a 4.7K resistor between VCC and the data pin
#define DHT22_PIN 13

// Setup a DHT22 instance
DHT22 dht( DHT22_PIN );

// Setup serial communication
void setup( void )
{
  Serial.begin( 9600 );
}

// Infinite loop
void loop( void )
{ 
  float celcius = 0;
  float farenheit = 0;  
  
  DHT22_ERROR_t error;
  
  // Sensor requires a warm-up after powering on
  // Can only be read every few seconds
  delay( 5000 );
  
  // Get the error code from the DHT22
  error = dht.readData();
  
  // Use the error code to determine next steps
  switch( error )
  { 
    // No error is good
    // Send off the temperature and humidity
    case DHT_ERROR_NONE:
      celcius = dht.getTemperatureC();
      farenheit = ( 1.8 * celcius ) + 32;
      
      Serial.print( farenheit );
      Serial.print( "," );
      Serial.println( dht.getHumidity() );     

      break;

    // Other possible errors
    case DHT_ERROR_CHECKSUM:
      Serial.println( "E,1");
      break;
      
    case DHT_BUS_HUNG:
      Serial.println( "E,2" );
      break;
    
    case DHT_ERROR_NOT_PRESENT:
      Serial.println( "E,3" );
      break;
      
    case DHT_ERROR_ACK_TOO_LONG:
      Serial.println( "E,4" );
      break;
      
    case DHT_ERROR_SYNC_TIMEOUT:
      Serial.println( "E,5" );
      break;
      
    case DHT_ERROR_DATA_TIMEOUT:
      Serial.println( "E,6" );
      break;
      
    case DHT_ERROR_TOOQUICK:
      Serial.println( "E,7" );
      break;
  }
}
