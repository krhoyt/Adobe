// JSON endpoint						  
var EMOTIONSTREAM = 'http://www.emotionstream.com/ws/useremotions.php';

// Emotional reference
var emotions = null;	
var placement = 0;

$( document ).ready( function() {
							  
	// Allow the user to move the window around the screen
	$( '.chrome' ).mousedown( function( evt ) {
		window.nativeWindow.startMove();									
	} );
	
	// Close/Quit the application when the "Close" button is clicked
	$( '.close' ).click( function( evt ) {
		window.nativeWindow.close();							  
	} );		
	
	// Center the window on the main screen
	// Then show the window
	window.nativeWindow.x = ( air.Capabilities.screenResolutionX - window.nativeWindow.width ) / 2;
	window.nativeWindow.y = ( air.Capabilities.screenResolutionY - window.nativeWindow.height ) / 2;	
	window.nativeWindow.visible = true;	
	
	// Search for the emotional status of a specific Twitter user
	$( '.search' ).click( doSearch );

	// Also triggered when the user uses the enter key
	$( 'form' ).submit( function( evt ) {
		evt.preventDefault();
		$( 'input' ).blur();
		doSearch( evt );
	} );

	// Allow slider movement by keyboard
	window.nativeWindow.stage.addEventListener( air.KeyboardEvent.KEY_UP, function( evt ) {
		if( $( '#slider' ).css( 'visibility' ) == 'visible' )
		{
			if( evt.keyCode == air.Keyboard.RIGHT && placement < 6 )
			{
				placement = placement + 1;
			}
			
			if( evt.keyCode == air.Keyboard.LEFT && placement > 0 )
			{
				placement = placement - 1;
			}
			
			// Update UI to match keyboard positioning
			$( '#slider' ).animate( {
				left: $( '.calendar' ).eq( placement ).position().left + 'px'					   
			}, {
				duration: 500,
				easing: 'easeOutCubic'
			} );		
			
			// Update the screen display and servo position
			$( '#face' ).html( emotions[placement].emotions[0] );
			expression( emotions[placement].emotions[0] );
		}
	} );

	// Slider
	var grab = 0;
	var delta = 0;

	$( '#slider' ).mousedown( function( evt ) {
		evt.preventDefault();
		
		grab = $( this ).position().left;
		delta = evt.pageX - grab;
		
		$( 'body' ).mousemove( function( evt ) {
			var diff = evt.pageX - delta;							
										
			if( diff >= 36 && diff <= 492 )
			{
				$( '#slider' ).css( 'left', diff + 'px' );							  
			}
		} )
		.mouseup( function( evt ) {
			var cals = null;
			var slider = null;
			
			$( this ).unbind( 'mousemove' );
			$( this ).unbind( 'mouseup' );
			
			slider = $( '#slider' ).position().left;			
			
			cals = new Array();
			
			$( '.calendar' ).each( function() {
				cals.push( $( this ).position().left );								
			} );
			
			// Look at the ranges
			for( var c = 0; c < cals.length - 1; c++ )
			{
				// Is the slider between this range?
				if( slider >= cals[c] && slider <= cals[c + 1] )
				{
					// Which side of the range is it closer to?
					if( ( slider - cals[c] ) <= ( cals[c + 1] - slider ) )
					{
						// Slide to lower end of range
						$( '#slider' ).animate( {
							left: cals[c] + 'px'
						}, {
							duration: 500,
							easing: 'easeOutCubic'
						} );
						
						placement = c;
					} else {
						// Slide to upper end of range
						$( '#slider' ).animate( {
							left: cals[c + 1] + 'px'
						}, {
							duration: 500,
							easing: 'easeOutCubic'
						} );
						
						placement = c + 1;			
					}
					
					$( '#face' ).html( emotions[placement].emotions[0] );								
					expression( emotions[placement].emotions[0] );
					
					break;
				}
			}
		} );
	} );

} );

function doSearch( evt )
{
	// Remove search functionality while searching
	$( '.search' )
		.addClass( 'disabled' )
		.removeClass( 'search' );
							   
	// Endpoint produces JSON
	// Needs to know Twitter user
	$.getJSON(
		EMOTIONSTREAM,
		{
			user: $( 'input' ).attr( 'value' )	
		},
		function( data, status ) {
			var strings = null;				
			var timeline = data.emotiontimeline;
			var value = null;

			emotions = new Array();

			// Gather the object data
			for( date in timeline )
			{
				// Object to hold the data
				value = new Object();
				value.date = date;
				value.emotions = new Array();
				
				// More than one emotion possible per day
				for( emotion in timeline[date] )
				{
					value.emotions.push( emotion );
				}
				
				// Add the value object to the overall data
				emotions.push( value );
			}
			
			// TODO: Deal with when there is less than seven results
			// air.trace( 'Found: ' + emotions.length );
			
			// Display seven days of emotional history
			for( var d = 0; d < 7; d++ )
			{
				// Split the "date" string from the JSON result
				strings = emotions[d].date.split( ' ' );

				// Populate calendar values
				$( '#day' + d + ' > .day' ).html( strings[0].toUpperCase() );
				$( '#day' + d + ' > .month' ).html( strings[2].toUpperCase() );
				$( '#day' + d + ' > .date' ).html( strings[1] );
				$( '#day' + d + ' > .year' ).html( strings[3] );
		
				// Make day visible if it is not already
				$( '#day' + d ).css( 'visibility', 'visible' );
			}
			
			// Make slider visible if it is not already
			$( '#slider' ).css( 'visibility', 'visible' );
			$( '.bar' ).css( 'visibility', 'visible' );

			// Show emotional reference
			// Position servo to show likewise
			$( '#face' ).html( emotions[placement].emotions[0] );
			expression( emotions[placement].emotions[0] );

			// Restore search functionality
			$( '.disabled' )
				.addClass( 'search' )
				.removeClass( 'disabled' );				
		}
	);					
} 