int ch1;
int ch2;
int ch3;
int ch4;
int ch5;
int ch6;

void setup() 
{
  pinMode( 5, INPUT );
  pinMode( 6, INPUT );
  pinMode( 7, INPUT );

  Serial.begin( 9600 );
}

void loop() 
{
  ch1 = pulseIn( 1, HIGH, 25000 );
  ch2 = pulseIn( 2, HIGH, 25000 );
  ch3 = pulseIn( 3, HIGH, 25000 );
  ch4 = pulseIn( 4, HIGH, 25000 );
  ch5 = pulseIn( 5, HIGH, 25000 );
  ch6 = pulseIn( 6, HIGH, 25000 );
  
  Serial.print( ch1 );
  Serial.print( ", " );
  Serial.print( ch2 );
  Serial.print( ", " );   
  Serial.print( ch3 );  
  Serial.print( ", " );
  Serial.print( ch4 );
  Serial.print( ", " );   
  Serial.print( ch5 );
  Serial.print( ", " );   
  Serial.println( ch6 );  

  delay( 1000 );
}
 
