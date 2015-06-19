int inputPin = 2;
int pirState = LOW;
int val = 0;

void setup() 
{
  pinMode( inputPin, INPUT );
  Serial.begin( 9600 );
}

void loop()
{
  val = digitalRead( inputPin );

  if( val == HIGH ) 
  {
    if( pirState == LOW ) 
    {
      Serial.print( 1 );
      Serial.print( 0, BYTE );
      pirState = HIGH;
    }
  } else {
    if( pirState == HIGH )
    {
      Serial.print( 0 );
      Serial.print( 0, BYTE );
      pirState = LOW;
    }
  }
}
