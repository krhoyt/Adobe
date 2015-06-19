$( document ).ready( function() {
	
	$( window ).resize( function() {
		layout();	
	} );	
	
	layout();
	
} ).mousemove( function( evt ) {

	var opposite = Math.round( ( $( document ).width() / 2 ) - evt.pageX );
	var adjacent = $( document ).height() - evt.pageY - 142;
	
	var angle = Math.round( Math.atan( opposite / adjacent ) * 180 / Math.PI * 100 ) / 100;

	angle = 0 - angle;

	$( '#arrow' ).css( '-moz-transform', 'rotate(' + angle + 'deg)' );
	$( '#arrow' ).css( '-webkit-transform', 'rotate(' + angle + 'deg)' );	

} );

function layout()
{
	$( '#arrow' ).css( 'left', Math.round( ( $( document ).width() - $( '#arrow' ).width() ) / 2 ) );	
}