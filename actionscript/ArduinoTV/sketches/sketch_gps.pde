#include <NewSoftSerial.h>

#define BUFFSIZ 90
#define GPSRATE 4800
#define POWERPIN 4

NewSoftSerial soft = NewSoftSerial( 3, 2 );

char buffer[BUFFSIZ];
char *parseptr;
char buffidx;
uint8_t hour, minute, second, year, month, date;
uint32_t latitude, longitude;
uint8_t groundspeed, trackangle;
char latdir, longdir;
char status;

void setup() 
{ 
  if( POWERPING ) 
  {
    pinMode( POWERPIN, OUTPUT);
  }
  
  pinMode( 13, OUTPUT );
  
  Serial.begin( GPSRATE );
  soft.begin( GPSRATE );
   
   digitalWrite( POWERPIN, LOW );
} 
 
 
void loop() 
{ 
  Serial.println( readline() );
}

uint32_t parsedecimal(char *str) {
  uint32_t d = 0;
  
  while (str[0] != 0) {
   if ((str[0] > '9') || (str[0] < '0'))
     return d;
   d *= 10;
   d += str[0] - '0';
   str++;
  }
  return d;
}

void readline(void) {
  char c;
  
  buffidx = 0; // start at begninning
  while (1) {
      c=mySerial.read();
      if (c == -1)
        continue;
      Serial.print(c);
      if (c == '\n')
        continue;
      if ((buffidx == BUFFSIZ-1) || (c == '\r')) {
        buffer[buffidx] = 0;
        return;
      }
      buffer[buffidx++]= c;
  }
}
