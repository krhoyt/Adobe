// Get a reference to the servo
var phidget = new runtime.com.phidgets.PhidgetServo();

// Listen for when attached
phidget.addEventListener( runtime.com.phidgets.events.PhidgetEvent.ATTACH, function( evt ) {
	// Set the beginning position
	// Fixed value
	// Servos do not cover full operational range
	phidget.setPosition( 0, 37 );
} );

// Stop powering the servo when the application exits
air.NativeApplication.nativeApplication.addEventListener( air.Event.EXITING, function( evt ) {
	phidget.setEngaged( 0, false );																				
} );

// Open a connection to the servo (Phidget socket server)
phidget.open( 'localhost', 5001 );

function expression( face )
{
	// The distance to jump for each stop
	// 207 - 37 = 170
	// 170 / 8 = 21.25
	var stops = 21;
	var offset = 0;

	switch( face )
	{
		case ':)':
			offset = 0;
			break;

		case 'lol':
			offset = 1;
			break;

		case ':(':
			offset = 2;
			break;

		case ':O':
			offset = 3;
			break;

		case ':#':
			offset = 4;
			break;

		case ':\'(':
			offset = 5;
			break;

		case '}:(':
			offset = 6;
			break;

		case ':/':
			offset = 7;
			break;
	}

	// Calculate and set new position
	offset = ( stops * offset ) + 37;
	phidget.setPosition( 0, offset );
}