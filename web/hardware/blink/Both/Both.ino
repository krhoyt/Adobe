#define LED_PIN 11
#define PHOTOCELL_PIN 0

void setup()
{
  Serial.begin( 9600 ); 
  
  pinMode( LED_PIN, OUTPUT );
  digitalWrite( LED_PIN, LOW );
}

void loop()
{
  int incoming = 0;
  int reading = analogRead( PHOTOCELL_PIN );

  Serial.print( "Analog reading = " );
  Serial.println( reading ); 
  
  if( Serial.available() > 0 )
  {
    incoming = Serial.read();
   
    if( incoming == 48 )
    {
      digitalWrite( LED_PIN, LOW );
    } else {
      digitalWrite( LED_PIN, HIGH ); 
    }
    
    Serial.print( "Incoming value = " );
    Serial.println( incoming );
  }
  
  delay( 1000 );
}
