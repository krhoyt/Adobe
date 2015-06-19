int ledPin =  13;

void setup()   
{                
  Serial.begin( 9600 );
  pinMode( ledPin, OUTPUT );     
}

void loop()                     
{
  int incoming = 0;

  if( Serial.available() > 0 )
  {
    incoming = Serial.read();
    
    if( incoming == 0 )
    {
      digitalWrite( ledPin, LOW );    
    } else {  
      digitalWrite( ledPin, HIGH );
    }
    
    Serial.println( incoming );
  }

  delay( 100 );               
}
