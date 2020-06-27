// Keypad library
// http://www.arduino.cc/playground/code/Keypad
#include <Keypad.h>

// How many rows and columns on the keypad
const byte ROWS = 4;
const byte COLS = 3;

// Where the keypad characters are placed
char keys[ROWS][COLS] = {
  {'1','2','3'},
  {'4','5','6'},
  {'7','8','9'},
  {'*','0','#'}
};

// Maps keypad to Arduino pins
// http://dlnmh9ip6v2uc.cloudfront.net/datasheets/Components/General/SparkfunCOM-08653_Datasheet.pdf
byte rowPins[ROWS] = {7, 2, 3, 5};
byte colPins[COLS] = {6, 12, 4};

// Instiate the keypad library
Keypad keypad = Keypad( makeKeymap( keys ), rowPins, colPins, ROWS, COLS );

// Setup the Arduino to send serial data
void setup()
{
  Serial.begin( 9600 );
}

// Loop
void loop()
{
  // Get the key from the keypad
  char key = keypad.getKey();
  
  // If there is something there
  // Send the data along the serial output
  if( key != NO_KEY )
  {  
    Serial.println( String( key ) );     
  }
}
