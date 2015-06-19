#include <NewSoftSerial.h>

#define BUFFSIZ 90
#define GPSRATE 4800
#define POWERPIN 4

NewSoftSerial soft = NewSoftSerial( 3, 2 );

char buffer[BUFFSIZ];
char buffidx;

void setup() 
{ 
  if( POWERPIN ) 
  {
    pinMode( POWERPIN, OUTPUT);
  }
  
  pinMode( 13, OUTPUT );
  
  Serial.begin( 9600 );
  soft.begin( GPSRATE );
   
  digitalWrite( POWERPIN, LOW );
} 
 
 
void loop() 
{ 
  readline();
  
  Serial.print( buffer );
  Serial.print( 0, BYTE );
}

void readline( void ) 
{
  char c;
  
  buffidx = 0;
  
  while( 1 ) 
  {
      c = soft.read();
      
      if( c == -1 )
      {
        continue;
      }
      
      if( c == '\n' )
      {
        continue;
      }
      
      if( ( buffidx == BUFFSIZ - 1 ) || ( c == '\r' ) ) 
      {
        buffer[buffidx] = 0;
        return;
      }
      
      buffer[buffidx++]= c;
  }
}
