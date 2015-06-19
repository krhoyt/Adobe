$( document ).ready( function() {
							  
	// Phidget reference
	var phidget = new runtime.com.phidgets.PhidgetRFID();
	
	// Setup the RFID reader when the Phidget is attached
	phidget.addEventListener( runtime.com.phidgets.events.PhidgetEvent.ATTACH, function( evt ) {
		phidget.Antenna = true;
		phidget.LED = false;
	} );
	
	// Called when a tag is detected 
	phidget.addEventListener( runtime.com.phidgets.events.PhidgetDataEvent.TAG, function( evt ) {
		
		// Show the user the LED as feedback of acquisition
		phidget.LED = true;
		
		// Loop through the shelves to find a match
		$( '.shelf' ).each( function( index, value ) {
									 
			// Get the book image for this shelf
			var img = $( this ).find( 'img' ).eq( 0 );
						
			// If the title attribute matches the RFID tag			
			if( $( img ).attr( 'title' ) == evt.Data )
			{
				// Scroll to shelf and stop iteration
				$( '#case' ).scrollTo( 
					( 211 + ( ( index - 1 ) * 265 ) ) + 'px', 
					800, 
					{easing: 'easeOutCubic'} 
				);
				return false;
			}
		} );
	} );
	
	// Provide visual feedback that a tag is no longer detected
	phidget.addEventListener( runtime.com.phidgets.events.PhidgetDataEvent.TAG_LOST, function( evt ) {
		phidget.LED = false;
	} );
	
	// Connect to the Phidget
	phidget.open( "localhost", 5001 );
	
} );