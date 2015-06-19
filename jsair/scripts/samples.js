var opened = false;

$( document ).ready( function() {
	
	var count = 0;
	var samples = $( '.button' ).size();
	
	$( '.header:first' )
	.click( function( e ) {
		if( opened )
		{
			$( '.button' ).hide(); 	
			opened = false;
		} else {
			$( '.button' ).show();
			opened = true;
		}
	} );
	
	$( '.count:first' ).text( '(' + samples + ' samples)' );
	
	$( '#list > .section' ).each( function() {
		var count = $( this ).children().size() - 1;

		$( this ).find( '.header:first > span:last' ).text( '(' + count + ' samples)' );
	} );
		
	$( '#list')
	.find( '.button' )
	.toggle()
	.end()
	.find( '.header' )
	.click( function( e ) {
		$( this ).parent().find( '.button' ).toggle();						 
	} );	

} );