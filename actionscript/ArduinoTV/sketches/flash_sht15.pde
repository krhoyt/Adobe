#include <SHT1x.h>

#define dataPin  8
#define clockPin 9

SHT1x sht1x( dataPin, clockPin );

void setup()
{
   Serial.begin( 9600 );
}

void loop()
{
  float temp_f;
  float humidity;

  temp_f = sht1x.readTemperatureF();
  humidity = sht1x.readHumidity();

  Serial.print( temp_f );
  Serial.print( "," );
  Serial.print( humidity );
  Serial.print( 0, BYTE );

  delay( 100 );
}
