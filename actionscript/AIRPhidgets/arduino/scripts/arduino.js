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

	// Draw the initial chart
    $.plot( $( '#chart' ), [series], options );

	// Hold analog sensor value
	// Use a socket to connect to the server
	// Though the class is called XMLSocket, there is no XML used
	// Simply looks for a carriage return to end packet
	// Then presents the data in the data event
	var analog = 0;						  
	var socket = new air.XMLSocket();
	
	// Called when the socket has connected to the server
	socket.addEventListener( air.Event.CONNECT, function( evt ) {
		
		// Incrementally fetch recent analog data value
		// Rebuild/update chart
		setInterval( function() { 
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
			data[99] = [99, analog];
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
			
			// Update the chart
	    	$.plot( $( '#chart' ), [series], options );					
			
		}, 50 );													 
	} );
	
	// Called when there is new data
	// Stores value for reference
	// A single number values is transmitted
	socket.addEventListener( air.DataEvent.DATA, function( evt ) {
		var convert = new Number( evt.data );
		
		// Watch for junk data on the wire
		if( convert >= 0 )
		{
			analog = convert;								 				
		}			
	} );

	// Open the socket connection
	socket.connect( '127.0.0.1', 5331 );

} );