$( document ).bind( 'deviceready', function() {
	var watchId = 0;
		
	$( '#btnWatch' ).bind( 'touchstart', function() {
		var options = null;
		
		if( watchId == 0 )
		{
			// Minimum of 40ms
			// Maximum of 1000ms
			// Greater than maximum waits for callback
			options = {
				frequency: 100
			};			
			
			watchId = navigator.accelerometer.watchAcceleration( function( acceleration ) {
				$( '#txtX' ).attr( 'value', acceleration.x );
				$( '#txtY' ).attr( 'value', acceleration.y );
				$( '#txtZ' ).attr( 'value', acceleration.z );
			}, function( error ) {
				console.log( 'Error' );
			}, options );
			
			$( this ).html( 'Stop Watching' );			
		} else {
			navigator.accelerometer.clearWatch( watchId );
			watchId = 0;
			
			$( this ).html( 'Watch Accelerometer' );
		}
	} );
} );