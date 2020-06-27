const int CHIP_SELECT = 13;
const int CLOCK = 11;
const int DATA = 12;

void setup() 
{
  Serial.begin( 9600 );
  
  pinMode( CHIP_SELECT, OUTPUT );
  pinMode( CLOCK, OUTPUT );
  pinMode( DATA, OUTPUT );

  digitalWrite( CHIP_SELECT, LOW );
  digitalWrite( CLOCK, LOW );
  
  delayMicroseconds( 1 );
  
  digitalWrite( CHIP_SELECT, HIGH );
  digitalWrite( CLOCK, HIGH );
}

void loop() 
{
  int aX = GetValue( B1000 );
  int aY = GetValue( B1001 );
  int aZ = GetValue( B1010 );

  Serial.print( aX );
  Serial.print( "," );
  Serial.print( aY );
  Serial.print( "," );
  Serial.println( aZ );
  
  delay( 100 );
}

void StartBit() 
{
  pinMode( DATA, OUTPUT );

  digitalWrite( CHIP_SELECT, LOW );
  digitalWrite( CLOCK, LOW );
  delayMicroseconds( 1 );

  digitalWrite( DATA, HIGH );
  digitalWrite( CLOCK, HIGH );
  delayMicroseconds( 1 );
}

void ShiftOutNibble( byte DataOutNibble ) 
{
  for( int i = 3; i >= 0; i-- ) 
  {
    digitalWrite( CLOCK, LOW );

    if( ( DataOutNibble & ( 1 << i ) ) == ( 1 << i ) ) 
    {
      digitalWrite( DATA, HIGH );      
    } else {
      digitalWrite( DATA, LOW );
    }

    digitalWrite( CLOCK, HIGH );
    delayMicroseconds( 1 );
  }
}

void SampleIt() 
{
  digitalWrite( CLOCK, LOW );
  delayMicroseconds( 1 );
  
  digitalWrite( CLOCK, HIGH );
  delayMicroseconds( 1 );

  pinMode( DATA, INPUT );
  digitalWrite( CLOCK, LOW );
  delayMicroseconds( 1 );
  digitalWrite( CLOCK, HIGH );
  
  if( digitalRead( DATA ) == LOW ) {;}
}

byte ShiftInNibble() 
{
  byte resultNibble = 0;

  for( int i = 3; i >= 0; i-- ) 
  {
    digitalWrite( CLOCK, LOW );
    delayMicroseconds( 1 );

    if( digitalRead( DATA ) == HIGH ) 
    {
      resultNibble += 1 << i;
    } else {
      resultNibble += 0 << i;
    }
      
    digitalWrite( CLOCK, HIGH );
  }

  return resultNibble;
}

void EndBit() 
{
  digitalWrite( CHIP_SELECT, HIGH );
  digitalWrite( CLOCK, HIGH );
}

int GetValue( byte Command ) 
{
  int Result = 0;
  
  StartBit();
  ShiftOutNibble( Command );
  SampleIt();
  
  Result =  2048 - ( ( ShiftInNibble() << 8 ) + ( ShiftInNibble() << 4 ) + ShiftInNibble() );
  
  EndBit();

  return Result;
}

