int maximum = 0;

void setup()
{
  Serial.begin( 9600 ); 
}

void loop()
{
  int voltage = analogRead( 0 ); 
  int weight = map( voltage, 0, 985, 0, 100 );
  
  if( voltage > maximum )
  {
    maximum = voltage; 
  }
  
  Serial.print( maximum );
  Serial.print( "," );
  Serial.print( voltage );
  Serial.print( "," );
  Serial.println( weight );
  
  delay( 100 );
}
