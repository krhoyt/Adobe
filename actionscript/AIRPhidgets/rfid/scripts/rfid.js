$( document ).ready( function() {
	
	// Instantiate the Phidget RFID reference
	var phidget = new runtime.com.phidgets.PhidgetRFID();
	
	// Listen for when the application is connected to the driver (socket)
	phidget.addEventListener( runtime.com.phidgets.events.PhidgetEvent.ATTACH, function( evt ) {
		
		// Turn on the Phidget RFID antenna
		// Turn off the indicator LED that is on the board
		phidget.Antenna = true;
		phidget.LED = false;
	} );
	
	// Listen for when there is a tagged item near the RFID reader
	phidget.addEventListener( runtime.com.phidgets.events.PhidgetDataEvent.TAG, function( evt ) {
		
		// Turn on the LED to let the user know we have acquisition
		// Show the tag that is near the reader
		phidget.LED = true;
		$( '#tag' ).html( evt.Data );																					
	} );
	
	// Listen for when the tagged item is removed
	phidget.addEventListener( runtime.com.phidgets.events.PhidgetDataEvent.TAG_LOST, function( evt ) {
		
		// Turn off the LED to let the user know we lost acquisition
		// Clear the user interface
		phidget.LED = false;
		$( '#tag' ).html( "" );																					
	} );
	
	// Open a connection to the Phidget driver
	// Can be on another system
	// Port is configured as part of the driver itself
	phidget.open( "localhost", 5001 );
	
} );