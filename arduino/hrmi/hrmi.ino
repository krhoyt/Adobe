#include "Wire.h"

#define HRMI_I2C_ADDR      127
#define HRMI_HR_ALG        1

void setup()
{
  setupHeartMonitor( HRMI_HR_ALG );
  Serial.begin( 9600 );
}

void loop()
{
  int heartRate = getHeartRate();
  Serial.println( heartRate );

  delay( 1000 );
}

void setupHeartMonitor( int type )
{
  Wire.begin();
  writeRegister( HRMI_I2C_ADDR, 0x53, type );
}

int getHeartRate()
{
  byte i2cRspArray[3];
  
  i2cRspArray[2] = 0;

  writeRegister( HRMI_I2C_ADDR,  0x47, 0x1 );

  if( hrmiGetData( 127, 3, i2cRspArray ) )
  {
    return i2cRspArray[2];
  } else{
    return 0;
  }
}

void writeRegister( int deviceAddress, byte address, byte val ) 
{
  Wire.beginTransmission( deviceAddress );
  Wire.write( address );
  Wire.write( val );
  Wire.endTransmission();
}

boolean hrmiGetData( byte addr, byte numBytes, byte* dataArray )
{
  Wire.requestFrom( addr, numBytes );
  
  if( Wire.available() ) 
  {
    for( int i = 0; i < numBytes; i++ )
    {
      dataArray[i] = Wire.read();
    }

    return true;
  } else{
    return false;
  }
}
