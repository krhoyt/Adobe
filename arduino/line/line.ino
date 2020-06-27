const int LED_LEFT = 11;
const int LED_RIGHT = 10;
const int PHOTOCELL_LEFT = 0;
const int PHOTOCELL_RIGHT = 1;

int minimum = 1000;
int maximum = 0;

void setup() 
{
  Serial.begin( 9600 );
  
  pinMode( PHOTOCELL_LEFT, INPUT );
  pinMode( PHOTOCELL_RIGHT, INPUT );
  
  pinMode( LED_LEFT, OUTPUT );
  pinMode( LED_RIGHT, OUTPUT );
}

void loop() 
{
  int left = 0;
  int right = 0;

  left = analogRead( PHOTOCELL_LEFT ); 
  right = analogRead( PHOTOCELL_RIGHT ); 

  if( left < minimum )
  {
    minimum = left; 
  }
  
  if( right < minimum )
  {
    minimum = right;  
  }
  
  if( left > maximum )
  {
    maximum = left; 
  }
  
  if( right > maximum )
  {
    maximum = right;  
  }  
  
  Serial.print( minimum );
  Serial.print( "," );
  Serial.print( maximum );
  Serial.print( "," );  
  Serial.print( left );
  Serial.print( "," );
  Serial.println( right );
  
  left = map( left, minimum, maximum, 255, 0 );
  analogWrite( LED_LEFT, left );
  
  right = map( right, minimum, maximum, 255, 0 );
  analogWrite( LED_RIGHT, right );  
 }
