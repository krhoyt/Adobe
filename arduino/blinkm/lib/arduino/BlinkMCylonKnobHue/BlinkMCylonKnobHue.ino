/*
 * BlinkMCylon -- Create a multi-colored Cylon-like light show with a
 *                chain of several BlinkMs. 
 *                Demonstrates how to communicate with multiple BlinkMs 
 *                on a single I2C bus.
 *
 * BlinkM connections to Arduino
 * PWR - -- gnd -- black -- Gnd
 * PWR + -- +5V -- red   -- 5V
 * I2C d -- SDA -- green -- Analog In 4
 * I2C c -- SCK -- blue  -- Analog In 5
 *
 * There are 13 BlinkMs are addressed from 10..22.
 *
 * 2008 Tod E. Kurt, http://thingm.com/
 * 2011 updated by Tod E. Kurt
 *
 */

#include "Wire.h"
#include "BlinkM_funcs.h"

const int ledPin = 13;
const int knobPin = A0;

const int num_blinkms = 13;
//const int num_blinkms = 3;
const int blinkm_start_addr = 10;

//const int max_t2 = 1500;
const int max_t2 = 100;

byte curr_blinkm = 0;
int incdec = 1;  // only +1 or -1
byte t1;         // t1 runs from 0-255,0-255,... rolls over
int t2 = max_t2; // t2 is the number of t1s to wait before doing cylon thing
byte debug = 1;

const int colorChangeMillis = 6000;
long lastColorChangeMillis;

// a little status thing to show it's doing something
void toggleLed() {
    digitalWrite( ledPin, digitalRead(ledPin)==HIGH ? LOW : HIGH );
}

void setup()
{
    Serial.begin(19200);

    //Use ledPin to flash when we get stuff
    pinMode(ledPin, OUTPUT);
    digitalWrite(ledPin, HIGH);
    pinMode(knobPin, INPUT);

    BlinkM_begin();
    delay(10);
  
    // set all BlinkMs to known state
    BlinkM_stopScript( 0 );

    BlinkM_fadeToRGB(0, 255,255,255);
    delay(500);
    BlinkM_fadeToRGB( 0, 0,0,0); // fade to black

    Serial.print("BlinkMCylon ready\n");
}

//byte h;

byte r = 255;
byte g = 10;
byte b = 10;

// every loop poll knobs
// when t1 rolls over, update blinkm
// when t2 rolls over, move to next blinkm 
void loop()
{
    t1++;  // FIXME: should really base this on millis() instead of loop counts
    if( t1==0 ) {     // t1 has rolled over, update LED

        int hue = analogRead(knobPin) / 4;
        hsv_to_rgb( hue, 255,255, &r,&g,&b );
        
        //r = hue;
        //g = hue;
        //b = hue;
        /*
        // this is where sensor reading would go
        // but for now we'll do random color switch
        if( (millis() - lastColorChangeMillis) > colorChangeMillis ) {
            r = random(200);
            g = random(200);
            b = random(200);
            lastColorChangeMillis = millis();
        }
        if( digitalRead(buttonPin) == LOW ) {
            Serial.println("angry!");
            BlinkM_setFadeSpeed( 0, 30 );
            for( int i=0; i<3; i++ ) {
                BlinkM_setRGB( 0, 255,255,255 );
                BlinkM_fadeToRGB( 0, 0,0,0 );
                delay(250);
                BlinkM_setRGB( 0, 0,0,0 );
            }
            r = 255;
            g = 10;
            b = 10;
            lastColorChangeMillis = millis();
        }
        */

        // move to next LED
        t2--;
        if( t2==0 ) {   // t2 has rolled over, do cylon thing
            t2 = max_t2;
            toggleLed();
            byte blinkm_addr = blinkm_start_addr + curr_blinkm;
            //BlinkM_setFadeSpeed( blinkm_addr, 255);
            //BlinkM_fadeToRGB( blinkm_addr, r,g,b );
            //delay(50); // to allow fade to work
            BlinkM_stopScript( blinkm_addr ); // just in case
            BlinkM_setRGB( blinkm_addr, r,g,b );   // set to color
            //h = h + 20;
            //BlinkM_fadeToHSB( blinkm_addr, h,255,255 );
            BlinkM_setFadeSpeed( blinkm_addr, 10);
            BlinkM_fadeToRGB( blinkm_addr, 0,0,0); // fade to black

            // debug
            if( debug ) {
                Serial.print("r,g,b:");
                Serial.print(r,HEX);Serial.print(",");
                Serial.print(g,HEX);Serial.print(",");
                Serial.print(b,HEX);Serial.print(":");
                Serial.print("curr_blinkm:"); Serial.print(curr_blinkm,DEC);
                Serial.print(", addr:"); Serial.println(blinkm_addr,DEC);
            }

            // prepare to move to the next cylon eye element
            curr_blinkm = curr_blinkm + incdec;
            if( incdec == 1 && curr_blinkm == num_blinkms-1 )
                incdec = -1;
            else if( incdec == -1 && curr_blinkm == 0 )
                incdec = 1;
        }

    }
}


// Given a variable hue 'h', that ranges from 0-251,
// set RGB color value appropriately.
// Saturation and value also range from 0-251
// Performs purely integer math, no floating point.
//

static void hsv_to_rgb(uint8_t h, uint8_t s, uint8_t v,
                       uint8_t* r,  uint8_t* g, uint8_t* b)
{
    if( s==0 ) {  // zero saturation == grayscale, achromatic
      *r = *g = *b = v;
      return;
    }

    if( h > 251 ) h = 251;
    if( s > 251 ) s = 251;
    if( v > 251 ) v = 251;
    
    uint8_t hs  = h / 42;    // hue sector, gives 0-5
    uint8_t hss = hs * 42;   // hue sector start (0,42,84,126,168,210)
    uint8_t f   = h - hss;   // hue factorial (0-41)

    uint16_t p = (v * (251-s)) / 251;  // correct, "black level" basically
    uint16_t t = ((v-p)*f)/41;         // correct, "up slope"
    int16_t  q = ((p-v)*(f-41))/41;    // correct, "down slope"
    //int16_t  q = -((p-v)*(41-f)) / 41; // correct, "down slope"

    switch( hs ) {
    case 0:  *r = v;  *g = t;  *b = p;  break;
    case 1:  *r = q;  *g = v;  *b = p;  break;
    case 2:  *r = p;  *g = v;  *b = t;  break;
    case 3:  *r = p;  *g = q;  *b = v;  break;
    case 4:  *r = t;  *g = p;  *b = v;  break;
    case 5:  *r = v;  *g = p;  *b = q;  break;
    }
}
