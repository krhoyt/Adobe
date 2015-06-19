$( function() {
			
	// Track high/low values over a range
	var high = -1;
	var low = -1;		
			
	// Chart variables		
    var data = [];
	var options = {
		lines: {
			show: true
		},
		points: {
			show: false
		},
		yaxis: {
			min: 0,
			max: 1000
		},
		grid: {
			borderWidth: 1
		}
	};
	var series = {
		color: 'rgb( 36, 64, 107 )',
		data: data
	};	

	// Seed the chart data
	for( var d = 0; d < 100; d++ )
	{
		data.push( [d, 0] );		
	}

	// Draw the chart
    $.plot( $( '#chart' ), [series], options );

	// Setup connection to hardware
	var phidget = new runtime.com.phidgets.PhidgetInterfaceKit();
	
	// When the hardware has been attached we can collect data 
	phidget.addEventListener( runtime.com.phidgets.events.PhidgetEvent.ATTACH, function( evt ) {
		
		// Ping the sensor every 50 milliseconds
		// Does not mean that new data is available
		setInterval( function() {
							  
			// Get the sensor value
			// Map range to height of display
			var value = phidget.getSensorValue( 0 ); 
			var step = 1000 / 339;

			// Move the data over (shift)
			// Shift not used
			// The values themselves need to change along the way
			for( var d = 0; d < 99; d++ )
			{
				data[d] = [d, data[d+1][1]];
			}

			// Put the latest value on the end
			// Set as data for the series
			data[99] = [99, value];
			series.data = data;

			// Clear range high/low values
			high = -1;
			low = -1;

			// Find high/low values for the series
			for( d = 0; d < 100; d++ )
			{
				if( high == -1 || data[d][1] > high )
				{
					high = data[d][1];
				}

				if( low == -1 || data[d][1] < low )
				{
					low = data[d][1];
				}
			}
			
			// Display high/low for series
			$( '#imghigh' ).css( 'top', 339 - ( high / step ) + 89 - 6 + 'px' );
			$( '#imglow' ).css( 'top', 339 - ( low / step ) + 89 - 6 + 'px' );

			/* Alternatively: All-time high and low values
			if( high == -1 || value > high )
			{
				high = value;	
				$( '#imghigh' ).css( 'top', 339 - ( high / step ) + 89 - 6 + 'px' );
			}
			
			if( low == -1 || value < low )
			{
				low = value;	
				$( '#imglow' ).css( 'top', 339 - ( low / step ) + 89 - 6 + 'px' );				
			}			
			*/
	
			// Update the chart
	    	$.plot( $( '#chart' ), [series], options );
		}, 50 );		
	} );

	phidget.open( "localhost", 5001 );
} );