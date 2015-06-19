$( document ).bind( 'deviceready', function() {

	$( '#txtModel' ).attr( 'value', device.name );
	$( '#txtSystem' ).attr( 'value', device.platform );
	$( '#txtVersion' ).attr( 'value', device.version );
	$( '#txtId' ).attr( 'value', device.uuid );
	$( '#txtGap' ).attr( 'value', device.phonegap );				

} );