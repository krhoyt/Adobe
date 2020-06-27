// Good reference for functionality of the 7-segment display
// https://github.com/sparkfun/Serial7SegmentDisplay/wiki/Special-Commands#wiki-brightness

// Software serial for displa
// Wire for sensor
#include <SoftwareSerial.h>
#include <Wire.h>

// Sensor details
const byte ADDRESS = 0x27;
const int  CLOCK_PIN = 5;
const int  DATA_PIN = 4;

// Display details
const int  RX_PIN = 0;
const int  TX_PIN = 1;

// Create a new software serial
SoftwareSerial Serial7Segment( RX_PIN, TX_PIN );

// Setup the sensor and segment
void setup() 
{
  // Open communications to display
  // Wait just a moment for serial to start
  Serial7Segment.begin( 9600 );
  delay( 10 );  

  // Clear the display
  Serial7Segment.write( 0x76 );

  // Brightness
  // 0 - 255 is dimmest to brightest respectively
  Serial7Segment.write( 0x7A );
  Serial7Segment.write( (byte)255 );  
  
  // Talk to sensor
  Wire.begin();
   
  // Turn on the HIH6130 sensor 
  pinMode( DATA_PIN, OUTPUT );
  digitalWrite( DATA_PIN, HIGH );   
  
  // Let sensor warm up
  delay( 5000 );
}

// Main functionality
void loop() 
{ 
  byte state;
  float farenheit;
  float humidity;
  float temperature; 
  int segment;
  
  // Read the values from the sensor
  // Takes local values to place sensor values
  // Returns sensor state
  state = getTemperatureHumidity( humidity, temperature );  
  
  // Convert to farenheit
  // Trim up for segment display
  // Four consecutive digits
  // No decimal point
  farenheit = ( temperature * 9 ) / 5 + 32;
  segment = farenheit * 100.0;
  Serial7Segment.print( segment );

  // Center decimal control
  Serial7Segment.write( 0x77 );
  Serial7Segment.write( 0b00000010 ); 
 
  // Wait a second for next update
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
