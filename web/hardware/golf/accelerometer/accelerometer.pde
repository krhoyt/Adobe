int CS_pin = 11;
int DIO_pin = 13;
int CLK_pin = 12;

byte tempLSB = 0;
byte tempMSB = 0;

int aX = 0;
int aY = 0;
int aZ = 0;

void setup() 
{
  Serial.begin( 9600 );
  
  pinMode( CS_pin, OUTPUT );
  pinMode( CLK_pin, OUTPUT );
  pinMode( DIO_pin, OUTPUT );

  digitalWrite( CS_pin, LOW );
  digitalWrite( CLK_pin, LOW );
  
  delayMicroseconds( 1 );
  
  digitalWrite( CS_pin, HIGH );
  digitalWrite( CLK_pin, HIGH );
}

void loop() 
{  
  Serial.print( 2048 - GetValue( B1000 ) );
  Serial.print( "," );
  Serial.print( 2048 - GetValue( B1001 ) );
  Serial.print( "," );
  Serial.println( 2048 - GetValue( B1010 ) );
  // Serial.print( 0, BYTE );

  delay( 200 );
}

void StartMassurement() 
{
  pinMode( DIO_pin, OUTPUT );
  
  digitalWrite( CS_pin, LOW );
  digitalWrite( CLK_pin, LOW );
  
  delayMicroseconds( 1 );

  digitalWrite( DIO_pin, HIGH );
  digitalWrite( CLK_pin, HIGH );

  delayMicroseconds( 1 );
}

void ShiftOutNibble( byte DataOutNibble ) 
{
  for( int i = 3; i >= 0; i-- ) 
  {
    digitalWrite( CLK_pin, LOW );

    if( ( DataOutNibble & ( 1 << i ) ) == ( 1 << i ) ) 
    {
      digitalWrite( DIO_pin, HIGH );
    } else {
      digitalWrite( DIO_pin, LOW );
    }
    
    digitalWrite( CLK_pin, HIGH );
    delayMicroseconds( 1 );
  }
}

void SampleIt() 
{
  digitalWrite( CLK_pin, LOW );
  delayMicroseconds( 1 );
  digitalWrite( CLK_pin, HIGH );
  delayMicroseconds( 1 );

  pinMode( DIO_pin, INPUT );
  digitalWrite( CLK_pin, LOW );
  delayMicroseconds( 1 );
  digitalWrite( CLK_pin, HIGH );
}

byte ShiftInNibble() 
{
  byte resultNibble;

  resultNibble = 0;

  for( int i = 3 ; i >= 0; i-- ) 
  {
    digitalWrite( CLK_pin, LOW );
    delayMicroseconds( 1 );

    if( digitalRead( DIO_pin ) == HIGH ) 
    {
      resultNibble += 1 << i;
    } else {
      resultNibble += 0 << i;
    }
	
    digitalWrite( CLK_pin, HIGH );
  }

  return resultNibble;
}

void EndMessurement() 
{
  digitalWrite( CS_pin, HIGH );
  digitalWrite( CLK_pin, HIGH );
}

int GetValue( byte Axis ) 
{
  int Result = 0;
  
  StartMassurement();
  ShiftOutNibble( Axis );
  SampleIt();
  Result =  ( ShiftInNibble() << 8 ) + ( ShiftInNibble() << 4 ) + ShiftInNibble();
  EndMessurement();

  return Result;
}
