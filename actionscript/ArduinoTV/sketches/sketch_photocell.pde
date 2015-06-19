int photocell = 0;
int reading;

void setup( void ) 
{
  Serial.begin( 9600 ); 
}

void loop( void ) 
{
  reading = analogRead( photocell ); 

  Serial.print( reading );
  Serial.print( 0, BYTE );
  
  delay( 100 );
}
