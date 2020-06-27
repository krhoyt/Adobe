#include <LiquidCrystal.h>

const int CONTRAST_AMOUNT = 200;
const int CONTRAST_PIN = 9;

LiquidCrystal lcd( 12, 11, 5, 4, 3, 2 );

void setup() 
{
  pinMode( CONTRAST_PIN, OUTPUT );
  analogWrite( CONTRAST_PIN, CONTRAST_AMOUNT );
  
  lcd.begin( 16, 2 );
  lcd.clear();
  lcd.setCursor( 0, 0 );
  lcd.print( "Hello, World!" );
}

void loop() 
{
  lcd.setCursor( 0, 1 );
  lcd.print( millis() / 1000 );
}

