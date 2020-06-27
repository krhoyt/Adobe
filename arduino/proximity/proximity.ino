#include "BlinkM_funcs.h"
#include "Wire.h"

#define BLINKM_LEFT 11
#define BLINKM_RIGHT 10
#define EL_WIRE 9

struct RGB 
{
  int     red;
  int     green;
  int     blue;
};

RGB products[13] = {
  {117, 184, 250}, // Photoshop
  {195, 125, 254}, // After effects
  {216, 59,  254}, // Premiere
  {235, 48,  161}, // InDesign
  {237, 0,   0},   // Flash
  {250, 171, 0},   // Illustrator
  {218, 212, 0},   // Fireworks
  {173, 230, 114}, // Muse
  {128, 236, 0},   // Dreamweaver
  {24,  212, 172}, // Audition
  {1,   234, 214}, // SpeedGrade
  {87,  192, 236}, // Prelude
  {157, 202, 217}  // Lightroom
};

void setup() 
{            
  Serial.begin( 9600 );
  
  pinMode( EL_WIRE, OUTPUT );
  digitalWrite( EL_WIRE, HIGH );  
  
  BlinkM_beginWithPower();
  BlinkM_stopScript( 0 );
  BlinkM_setRGB( 0, 0, 0, 0 );  
}

void loop() 
{
  int length = 0;
  
  length = sizeof( products ) / sizeof( RGB );

  BlinkM_fadeToRGB( 0, 255, 0, 0 );  
  delay( 3000 );
  
  for( int p = 0; p < length; p++ )
  {
    Serial.print( "Product: " );
    Serial.println( p );
    
    BlinkM_fadeToRGB( 0, products[p].red, products[p].green, products[p].blue );
    delay( 3000 );
  }
}
