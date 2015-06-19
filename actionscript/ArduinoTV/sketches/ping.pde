const int pingPin = 2;

void setup() 
{
  Serial.begin( 9600 );
}


void loop()
{
  long duration, inches;

  pinMode( pingPin, OUTPUT );
  digitalWrite( pingPin, LOW );
  delayMicroseconds( 2 );
  digitalWrite( pingPin, HIGH );
  delayMicroseconds( 5 );
  digitalWrite( pingPin, LOW );

  pinMode( pingPin, INPUT );
  duration = pulseIn( pingPin, HIGH );

  inches = microsecondsToInches( duration );

  Serial.println( inches, DEC );
  Serial.print( 0, BYTE );

  delay( 100 );
}

long microsecondsToInches( long microseconds )
{
  return microseconds / 74 / 2;
}
