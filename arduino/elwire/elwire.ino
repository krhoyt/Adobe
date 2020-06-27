int duration = 100;

void setup() 
{                
  // The EL channels are on pins 2 through 9
  // Initialize the pins as outputs
  pinMode( 2, OUTPUT );  // channel A  
  pinMode( 3, OUTPUT );  // channel B   
  pinMode( 4, OUTPUT );  // channel C

  // We also have two status LEDs
  // Pin 10 on the Escudo 
  // Pin 13 on the Arduino
  pinMode( 10, OUTPUT );     
  pinMode( 13, OUTPUT );    
}

void loop() 
{
  // Light the first wire for a second
  digitalWrite( 2, HIGH );
  delay( duration );
  
  // Turn off the first wire
  // Light the second wire for a second
  digitalWrite( 2, LOW );
  digitalWrite( 3, HIGH );  
  delay( duration );  
  
  // Turn off the second wire
  // Light the third wire for a second
  digitalWrite( 3, LOW );
  digitalWrite( 4, HIGH );  
  delay( duration );    
  
  // Turn off the third wire for a second
  digitalWrite( 4, LOW );  
  delay( duration );  
}
