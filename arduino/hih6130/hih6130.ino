// Original code reference:
// http://www.phanderson.com/arduino/hih6130.html
// Data sheet:
// http://sensing.honeywell.com/index.php/ci_id/142165/la_id/1/document/1/re_id/0
// I2C reference:
// http://sensing.honeywell.com/index.php?ci_id=142171
    
// I2C library
#include <Wire.h>

// Sensor I2C address
// Data pin from sensor
const byte ADDRESS = 0x27;
const int  CLOCK_PIN = 5;
const int  DATA_PIN = 4;

// Setup
void setup()
{
  // Start serial and 1-wire communication
  Serial.begin( 9600 );
  Wire.begin();
   
  // Turn on the HIH6130 sensor 
  pinMode( DATA_PIN, OUTPUT );
  digitalWrite( DATA_PIN, HIGH ); 
  
  // Give sensor time to start up 
  delay( 5000 );
}
    
// Loop
void loop()
{
  byte state;
  float humidity;
  float temperature;
   
  // Read the values from the sensor
  // Takes local values to place sensor values
  // Returns sensor state
  state = getTemperatureHumidity( humidity, temperature );
  
  // Report on sensor state    
  switch( state )
  {
    case 0:  
      Serial.print( "normal" );
      break;
    case 1:  
      Serial.print( "stale data" );
      break;
    case 2:  
      Serial.print( "command mode" );
      break;
    default: 
      Serial.print( "diagnostic" ); 
      break; 
  }

  // Report temperature and humidity
  // Temperature reported in celcius first
  // Celcius is what comes out of the sensor
  // Converted and reported as farenheit second
  Serial.print( "," );
  Serial.print( humidity );
  Serial.print( "," );
  Serial.print( temperature );
  Serial.print( "," );
  Serial.println( ( temperature * 9 ) / 5 + 32 );
  
  // Give it a second before updating
  delay( 1000 );
}

// Retrieve temperature and humidity values from HIH6130
// Takes humidity and temperature references
// Updates them inside the function
// Returns the sensor state as a value directly
byte getTemperatureHumidity( float &hdata, float &tdata )
{
  byte hhigh;
  byte hlow;
  byte state;
  byte thigh;
  byte tlow;

  // Let the sensor know we are coming
  Wire.beginTransmission( ADDRESS ); 
  Wire.endTransmission();
  delay( 100 );
      
  // Read the data packets
  Wire.requestFrom( (int)ADDRESS, 4 );
  hhigh = Wire.read();
  hlow = Wire.read();
  thigh = Wire.read();
  tlow = Wire.read();
  Wire.endTransmission();
      
  // Slice of state bytes
  state = ( hhigh >> 6 ) & 0x03;
  
  // Clean up remaining humidity bytes
  hhigh = hhigh & 0x3f;
  
  // Shift humidity bytes into a value
  // Convert value to humidity per data sheet  
  hdata = ( ( (unsigned int)hhigh ) << 8 ) | hlow;
  hdata = hdata * 6.10e-3;
      
  // Shift temperature bytes into a value
  // Convert value to temperature per data sheet
  tdata = ( ( (unsigned int)thigh ) << 8 ) | tlow;
  tdata = tdata / 4;
  tdata = tdata * 1.007e-2 - 40.0;

  // Return the sensor state
  return state;
}
