$( document ).ready( function() {
	
	$( window ).resize( function() {
		layout();	
	} );
	layout();
	
} );

function layout()
{
	var horizontal = Math.round( ( $( window ).width() - $( '#frame' ).width() ) / 2 );
	var vertical = Math.round( ( $( window ).height() - $( '#frame' ).height() ) / 2 );	
	
	$( '#frame' ).css( 'left', horizontal );
	$( '#frame' ).css( 'top', vertical );
	
	if( $( '#save' ).size() > 0 )
	{
		horizontal = Math.round( ( $( window ).width() - $( '#save' ).width() ) / 2 );
		vertical = Math.round( ( $( window ).height() - $( '#save' ).height() ) / 2 );		
	
		$( '#save' ).css( 'left', horizontal );
	}
}