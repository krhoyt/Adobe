function doDeviceReady()
{
	$( document ).bind( 'touchstart touchmove', function( evt ) {
		var adjacent = 0;
		var angle = 0;
		var opposite = 0;
		var touch = evt.originalEvent.touches[0];
		
		evt.preventDefault();
	
		opposite = Math.round( 160 - touch.clientX );
		adjacent = 480 - touch.clientY - 17;
		
		angle = Math.round( Math.atan( opposite / adjacent ) * 180 / Math.PI * 100 ) / 100;
		angle = 0 - angle;
	
		$( '#arrow' ).css( '-webkit-transform', 'rotate(' + angle + 'deg)' );			
	} );
}

function doLoad()
{
	document.addEventListener( 'deviceready', doDeviceReady );
}

function doTouchMove( evt )
{
	evt.preventDefault();	
}