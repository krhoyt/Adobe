// Called once at the start
// Configure the various parts
// In this case designate the LED on pin 13
void setup() 
{                
  pinMode( 13, OUTPUT );     
}

// Called repeatedly as fast as possible
// Does the core operation of your program
// In this case blinking an LED on pin 13
void loop() 
{
  // On for a second
  digitalWrite( 13, HIGH ); 
  delay( 100 );    

  // Off for a second  
  digitalWrite( 13, LOW );  
  delay( 100 );            
}
