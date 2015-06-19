// Constants
var HASH_MARK = '#';
var MERCURY = 0.000295299830714;
var NEWLINE = '\n';
var PORT = 5331;
var SOCKET = '127.0.0.1';
var VALUE_SEPARATOR = ',';

// Variables used mostly to track trending
var humidity = new Array( 10 );
var shtf = new Array( 10 );
var scpc = new Array( 10 );
var scpf = new Array( 10 );
var pressure = new Array( 10 );
var light = new Array( 10 );
var battery = new Array( 10 );
var record = new Array( 10 );		

$( document ).ready( function() {
	
	// Setup a socket to get the weather data
	// Provide for a buffer of incoming bytes
	var socket = new air.Socket();
	var weather = null;

	// Just let us know that the socket is connected to the server
	socket.addEventListener( air.Event.CONNECT, function( evt ) {
		air.trace( 'Connected' );													 
	} );
	
	// Called when data is received from the server
	// Incoming bytes may not represent an entire data set
	socket.addEventListener( air.ProgressEvent.SOCKET_DATA, function( evt ) {
		var eol = -1;
		var buffer = null;
		var line = null;
		var values = null;
	
		// Read any data on the buffer
		// May not represent entire record
		buffer = socket.readMultiByte( socket.bytesAvailable, 'us-ascii' )	
	
		// Essentially ignore first read
		// Ignore any latent data on the buffer
		if( weather == null )
		{
			weather = new String();	
		} else {
			// Append any new data to the buffer
			// Check for newline (end of data set marker)
			weather = weather + buffer;
			eol = weather.indexOf( NEWLINE );
			
			if( eol != -1 )
			{
				// Extract the line/record
				line = weather.substring( 1, eol - 2 );
				
				// Split the values
				values = line.split( VALUE_SEPARATOR );	

				// Humidity
				humidity.shift();
				humidity.push( new Number( values[0] ) );

				// Temperature (F)
				shtf.shift();
				shtf.push( new Number( values[1] ) );

				// Temperature (C)
				scpc.shift();
				scpc.push( new Number( values[2] ) );
				
				// Temperature (F)
				scpf.shift();
				scpf.push( new Number( values[3] ) );

				// Pressure in Pascals
				// Converted to the more common mmHg
				pressure.shift();
				pressure.push( new Number( values[4] ) );
				pressure[9] = new Number( ( pressure[9] * MERCURY ).toPrecision( 4 ) );

				// Light level
				light.shift();
				light.push( new Number( values[5] ) );
				
				// Bettery level/presence
				battery.shift();
				battery.push( new Number( values[6] ) );
				
				// Record ID
				record.shift();
				record.push( new Number( values[7] ) );					
				
				// Clean up the buffer
				// Removed parsed data
				weather = weather.substring( eol + 1, weather.length );
			}
		}
	} );
	
	// Connect to the socket
	socket.connect( SOCKET, PORT );
	
} );