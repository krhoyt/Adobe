$( document ).ready( function() {
	
	// Populate shelves with items
	$.getJSON( 
		'http://localhost:8301/rfid/Media.cfc?method=readAll',
		function( data ) {
			var img = null;
			
			for( var m = 0; m < data.length; m++ )
			{
				// Product image
				img = $( '<img src="http://localhost:8301/rfid/' + data[m].PATH + '"/>' )
					.attr( 'width', data[m].WIDTH )
					.attr( 'height', data[m].HEIGHT )
					.attr( 'title', data[m].RFID.substr( 0, data[m].RFID.length - 1 ) )
					.css( 'position', 'absolute' )
					.css( 'padding-top', '50px' )
					.css( 'left', ( ( 320 - data[m].WIDTH ) / 2 ) + 'px' );		
				
				// Add shelf
				$( '.shelf' )
					.eq( 0 )
					.clone()
					.prepend( img )
					.appendTo( '#case' );
			}
	
			// End buffer
			$( '.shelf' )
				.eq( 0 )
				.clone()
				.appendTo( '#case' );			

			// Position on first item
			$( '#case' ).scrollTo( '211px' );			
			
			// Show application
			window.nativeWindow.visible = true;				
		}
	);

	<!-- NOTE: Incomplete implementation on managing items -->
	$( '#btnadd' ).click( function() {
		$( '#btnmedia' ).css( 'visibility', 'visible' );
		
		$( '.sectionBlack' ).html( 'Add Media' );
		$( '.sectionWhite' ).html( 'Add Media' );
							
		$( '#btndone' ).css( 'visibility', 'visible' );
		$( '#btnadd' ).css( 'visibility', 'hidden' );	
							
		$( '#case' ).animate( { 
			left: '-320px'
		}, {
			duration: 800,
			easing: 'easeOutCubic'
		} );						   
		$( '#editor' ).animate( { 
			left: '0px'
		}, {
			duration: 800,
			easing: 'easeOutCubic'			
		} );						   
	} );
	
	$( '#btndone' ).click( function() {
		// Save media
		
		putBack();
	} );
	
	$( '#btnmedia' ).click( function() {
		// Clear fields

		putBack();
	} );	

	// Position window in the middle of the screen
	window.nativeWindow.x = ( air.Capabilities.screenResolutionX - window.nativeWindow.width ) / 2;
	window.nativeWindow.y = ( air.Capabilities.screenResolutionY - window.nativeWindow.height ) / 2;	

} );

function putBack()
{
	$( '#btnmedia' ).css( 'visibility', 'hidden' );					   
							   
	$( '.sectionBlack' ).html( 'All Media' );
	$( '.sectionWhite' ).html( 'All Media' );
						
	$( '#btndone' ).css( 'visibility', 'hidden' );
	$( '#btnadd' ).css( 'visibility', 'visible' );	
						
	$( '#case' ).animate( { 
		left: '0px'
	}, {
		duration: 800,
		easing: 'easeOutCubic'
	} );						   
	$( '#editor' ).animate( { 
		left: '320px'
	}, {
		duration: 800,
		easing: 'easeOutCubic'			
	} );						   
}