#include <PS2X_lib.h>

#define BUTTON_START      255
#define BUTTON_1          0
#define BUTTON_2          1  
#define BUTTON_3          2
#define BUTTON_4          3
#define NO_BUTTON         -1

#define GAMEPAD_CLK      13
#define GAMEPAD_CMD      11
#define GAMEPAD_ATT      10
#define GAMEPAD_DAT      12 

PS2X ps2x;

void setup() 
{                
  int error = 0;

  Serial.begin( 9600 );

  error = ps2x.config_gamepad( GAMEPAD_CLK, GAMEPAD_CMD, GAMEPAD_ATT, GAMEPAD_DAT, false, false );   

  if( error == 0 )
  {
    Serial.println( 'Found' );  
  } else if( error == 1 ) {
    Serial.println( 'Not found' ); 
  } else if( error == 2 ) {
    Serial.println( 'Not accepting' ); 
  } else if( error == 3 ) {
    Serial.println( 'Refusing pressure' ); 
  }
}

void loop() 
{
  int button = 0;

  button = read_buttons();

  // Serial.println( button, DEC );
  
  if( button == BUTTON_START )
  {
    Serial.println( "Start" );  
  } else if( button == BUTTON_1 ) {
    Serial.println( "Up" );      
  } else if( button == BUTTON_2 ) {
    Serial.println( "Right" );      
  } else if( button == BUTTON_3 ) {
    Serial.println( "Left" );      
  } else if( button == BUTTON_4 ) {
    Serial.println( "Down" );      
  }

  delay( 50 );
} 

int read_buttons()
{
  ps2x.read_gamepad( false, 0 );

  if( ps2x.Button( PSB_START ) ) return BUTTON_START; 
  if( ps2x.Button( PSB_PAD_UP ) ) return BUTTON_1;
  if( ps2x.Button( PSB_PAD_RIGHT ) ) return BUTTON_2;
  if( ps2x.Button( PSB_PAD_LEFT ) ) return BUTTON_3;
  if( ps2x.Button( PSB_PAD_DOWN ) ) return BUTTON_4;

  return NO_BUTTON;
}
