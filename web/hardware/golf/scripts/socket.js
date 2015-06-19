var NEWLINE = '\n';
var PORT = 5331;
var SOCKET = '127.0.0.1';

var offsets = {
	x: 0,
	y: 0
};
var sensors = null;
var socket = null;

$( document ).ready( function() {
	socket = new air.Socket();
	
	socket.addEventListener( air.Event.CONNECT, function( evt ) {
		air.trace( 'Connected' );													 
	} );
	
	socket.addEventListener( air.ProgressEvent.SOCKET_DATA, function( evt ) {
		var eol = -1;
		var buffer = null;
		var line = null;
		var tilt = 0;		
		var values = null;
	
		buffer = socket.readMultiByte( socket.bytesAvailable, 'us-ascii' );
	
		if( sensors == null )
		{
			sensors = new String();	
		} else {
			sensors = sensors + buffer;
			eol = sensors.indexOf( NEWLINE );
			
			if( eol != -1 )
			{
				line = sensors.substring( 0, eol - 2 );
				values = line.split( ',' );	
				
				sensors = sensors.substring( eol + 1, sensors.length );
				
				tilt = new Number( values[1] );
				
				if( tilt < 0 )
				{
					offsets.x = Math.abs( tilt );	
				} else {
					offsets.x = 0 - tilt;	
				}
				
				tilt = new Number( values[0] );
				
				if( tilt < 0 )
				{
					offsets.y = Math.abs( tilt );	
				} else {
					offsets.y = 0 - tilt;	
				}				
				
				offsets.x = Math.round( offsets.x / 100 );
				offsets.y = Math.round( offsets.y / 100 );
			}
		}
	} );	
	
	socket.connect( SOCKET, PORT );
} );