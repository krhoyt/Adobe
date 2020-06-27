const int PHOTOCELL = 0;

void setup() 
{
  Serial.begin( 9600 );
  pinMode( PHOTOCELL, INPUT );
}

void loop() 
{
  int light = 0;

  light = analogRead( PHOTOCELL );  
  Serial.println( light );
  delay( 100 );
 }
