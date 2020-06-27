#include <PS2X_lib.h>
#include "BlinkM_funcs.h"
#include "Wire.h"

#define MAX_LEDS          4      // Maximum number of leds to play

#define DELAY_PLAY_START  1000   // Initial delay during playtime
#define DELAY_PLAY_MIN    100    // Minimum delay during playtime. Delay will decay down to this value
#define DELAY_PLAY_DECAY  50     // Delay decreasing step.

#define BUTTON_START      255
#define BUTTON_1          0
#define BUTTON_2          1  
#define BUTTON_3          2
#define BUTTON_4          3
#define NO_BUTTON         -1

#define PIN_LED_1        20
#define PIN_LED_2        21
#define PIN_LED_3        22
#define PIN_LED_4        23

#define GAMEPAD_CLK      13
#define GAMEPAD_CMD      11
#define GAMEPAD_ATT      10
#define GAMEPAD_DAT      12 

#define MAX_SEQUENCE     256

PS2X ps2x;
byte pin[MAX_LEDS] = {
  PIN_LED_1, 
  PIN_LED_2, 
  PIN_LED_3, 
  PIN_LED_4
};
byte sequence[MAX_SEQUENCE];
byte stage;
int wait;

void shuffle()
{    
  for( int i = 0; i < stage; i++ ) 
  {
    sequence[i] = random( MAX_LEDS );
  }
}

void set_all_leds( int red, int green, int blue )
{
  BlinkM_setRGB( 0, red, green, blue );
}

void blink_all( int count, int time )
{
  for( int i = 0; i < count; i++ ) 
  {    
    BlinkM_setRGB( 20, 114, 183, 253 ); 
    BlinkM_setRGB( 21, 217, 59, 254 );  
    BlinkM_setRGB( 22, 250, 170, 0 );  
    BlinkM_setRGB( 23, 130, 238, 0 );      
    
    delay( time );

    BlinkM_setRGB( 0, 0, 0, 0 );

    delay( time / 2 );
  }    
}

void blink_one( byte pin_number, int count, int time )
{
  for( int i = 0; i < count; i++ ) 
  {
    if( pin_number == 0 )
    {
      BlinkM_setRGB( 20, 114, 183, 253 ); 
    } else if( pin_number == 1 ) {
      BlinkM_setRGB( 21, 217, 59, 254 );        
    } else if( pin_number == 2 ) {
      BlinkM_setRGB( 22, 250, 170, 0 );       
    } else if( pin_number == 3 ) {
      BlinkM_setRGB( 23, 130, 238, 0 );           
    }
    
    delay( time );

    BlinkM_setRGB( 0x00, 0, 0, 0 ); 
    
    delay( time / 2 );
  }    
}

void translate( int pad ) 
{
  if( pad == BUTTON_1 )
  {
    Serial.println( "up" );
  } else if( pad == BUTTON_2 ) {
    Serial.println( "right" ); 
  } else if( pad == BUTTON_3 ) {
    Serial.println( "left" ); 
  } else if( pad == BUTTON_4 ) {
    Serial.println( "down" ); 
  }
}

void play_sequence()
{
  for( int i = 0; i < stage; i++ ) 
  {
    Serial.print( "Playing " );
    translate( sequence[i] );
    
    if( pin[sequence[i]] == 20 )
    {
      BlinkM_setRGB( 20, 114, 183, 253  ); 
    } else if( pin[sequence[i]] == 21 ) {
      BlinkM_setRGB( 21, 217, 59, 254  );        
    } else if( pin[sequence[i]] == 22 ) {
      BlinkM_setRGB( 22, 250, 170, 0  );       
    } else if( pin[sequence[i]] == 23 ) {
      BlinkM_setRGB( 23, 130, 238, 0  );           
    }    
    
    delay( wait );

    BlinkM_setRGB( 0x00, 0, 0, 0  );         

    delay( 100 );
  }   
  
  delay( 200 );
  // blink_all( 5, 50 ); 
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

void blink_error( byte pin )
{
  blink_one( pin, 20, 50 );
}

boolean get_players_commands()
{
  int seqidx = 0;
  boolean error = false;
  int button;
  int expected = 0;
  int pressed = 0;
  unsigned long time;
  
  do {
    expected = sequence[seqidx];
    seqidx++;

    time = millis() + wait * 2;
    pressed = 0;
    button = NO_BUTTON;
    
    Serial.print( "Waiting for button " );
    translate( expected );
    // Serial.println( expected, DEC );

    do { 
      if( button == NO_BUTTON ) 
      {
        button = read_buttons();
        
        if( button != NO_BUTTON ) 
        {
          if( button == BUTTON_START ) 
          {
            Serial.println( "Restart" );
            return false;
          } else {
            Serial.print( "Entered " );
            // Serial.println( button );
            translate( button );
            
            if( button == expected ) 
            {
              digitalWrite( pin[button], HIGH ); 
              Serial.println( "Correct" );
              time = time - wait;
            } else {
              Serial.println( "Wrong" );
              blink_error( button );
              return false;
            }
          } 
        } 
      } else {
        delay( 50 );
      }      
      
      Serial.print( "Time: " );
      Serial.print( millis(), DEC );
      Serial.print( " - " );
      Serial.println( time, DEC );
    } while( millis() < time );

    if( button == NO_BUTTON ) 
    {
      Serial.println( "No play" );
      blink_error( expected );
      return false;
    }
  
    BlinkM_setRGB( 0x00, 0, 0, 0 );    
  } while( seqidx < stage );

  return true;
}

void initialize()
{
  Serial.println( "Initializing" );
  
  stage = 1;
  wait = DELAY_PLAY_START;  
  randomSeed( millis() );
  
  blink_all( 1, 1000 );
}

void blink_success()
{
  BlinkM_setRGB( 0x00, 0, 0, 0 ); 
  delay( 100 );
  
  for( int i = 0; i < 3; i++ ) 
  {
    for( int j = 0; j < MAX_LEDS; j++ ) 
    {
      blink_one( j, 1, 50 );
    }
  }
  
  BlinkM_setRGB( 0x00, 0, 0, 0 );
  delay( 500 );
}

void show_demo()
{
  boolean light = true;
  int light_counter = 0;
  
  Serial.println( "Demo" );
  
  do {
    if( light ) 
    {
      BlinkM_setRGB( 20, 0, 0, 0 );
      BlinkM_setRGB( 21, 217, 59, 254 );
      BlinkM_setRGB( 22, 250, 170, 0 );
      BlinkM_setRGB( 23, 0, 0, 0 );
    } else {
      BlinkM_setRGB( 20, 114, 183, 253 );
      BlinkM_setRGB( 21, 0, 0, 0 );
      BlinkM_setRGB( 22, 0, 0, 0 );
      BlinkM_setRGB( 23, 130, 238, 0 );     
    }
    
    delay( 20 );
    
    light_counter++;
    
    if( light_counter == 50 ) 
    {
      light_counter = 0;
      light = !light;
    }
  } while( read_buttons() != BUTTON_START );
  
  BlinkM_setRGB( 0x00, 0, 0, 0 );
  delay( 500 );
}

void setup() 
{                
  int error = 0;
  
  Serial.begin( 9600 );
  Serial.println( "Setup" );
  
  BlinkM_begin();
  BlinkM_stopScript( 0x00 );
  BlinkM_setRGB( 0x00, 0, 0, 0  ); 
  
  pinMode( 2, OUTPUT );
  digitalWrite( 2, HIGH );
  
  initialize();
  stage = 0;

  error = ps2x.config_gamepad( GAMEPAD_CLK, GAMEPAD_CMD, GAMEPAD_ATT, GAMEPAD_DAT );  
}

void loop() 
{
  stage++;
  
  if( stage == ( MAX_SEQUENCE ) - 1 ) 
  {
    initialize();
  }
  
  shuffle();
  play_sequence();
 
  if( get_players_commands() ) 
  {
    blink_success();
    wait -= DELAY_PLAY_DECAY;
    
    if( wait < DELAY_PLAY_MIN ) 
    {
      wait = DELAY_PLAY_MIN;
    } 
  } else {
    show_demo();
    stage = ( MAX_SEQUENCE ) - 2;
  }
}

