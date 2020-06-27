// Constants
const int BUTTON_PIN = 10;

// Watch for changes
int buttonState = 0;

// Setup the Arduino
void setup() 
{
  // Use designated pin as input
  // Voltage present when button pressed
  pinMode( BUTTON_PIN, INPUT );
  
  // Enable serial communication
  Serial.begin( 9600 );  
}

// Lop
void loop()
{
  int newState = 0;
  
  // Get the current state of the pin
  // Either high or low
  // Voltage present or not present
  newState = digitalRead( BUTTON_PIN );

  // If the state has changed
  if( newState != buttonState )
  {
    // If voltage is present
    // Button pressed
    if( newState == HIGH ) 
    {     
      // Display message pressed
      Serial.println( "Pressed" );
    } else {
      // Display message for released
      Serial.println( "Released" );
    }    
    
    // Update for the next iteration
    buttonState = newState;
  }
}

