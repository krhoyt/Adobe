// Variables to be used
var phidget = null;

$( document ).ready( function() {
	
	phidget = new runtime.com.phidgets.PhidgetServo();	

	// Listen for when attached
	phidget.addEventListener( runtime.com.phidgets.events.PhidgetEvent.ATTACH, function( evt ) {
		// Set the servo all the way to one side
		// The "minimum" side
		phidget.setPosition( 0, phidget.getPositionMin( 1 ) );
		
		// Create a slider within the range of the servo
		// Listen for slide changes to move servo position
		$( '#slider' ).slider( {
			min: phidget.getPositionMin( 1 ),
			max: phidget.getPositionMax( 1 ),
			slide: function( evt, ui ) {
				phidget.setPosition( 0, ui.value );
			}
		} );		
	} );

	// Stop powering the servo when the application exits
	air.NativeApplication.nativeApplication.addEventListener( air.Event.EXITING, function( evt ) {
		phidget.setEngaged( 0, false );																				
	} );

	// Open a connection to the servo (Phidget socket server)
	phidget.open( 'localhost', 5001 );

} );