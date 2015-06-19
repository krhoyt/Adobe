$( document ).bind( 'deviceready', function() {
    connection();	
	$( '#btnCheck' ).bind( 'touchstart', connection );
} );

function connection()
{
	switch( navigator.network.connection.type )
	{
		case Connection.UNKNOWN:
			$( '#imgConnection' ).attr( 'src', 'assets/unknown.png' );
			break;	
		case Connection.ETHERNET:
			$( '#imgConnection' ).attr( 'src', 'assets/ethernet.png' );
			break;	
		case Connection.WIFI:
			$( '#imgConnection' ).attr( 'src', 'assets/wireless.png' );
			break;			
		case Connection.CELL_2G:
			$( '#imgConnection' ).attr( 'src', 'assets/2g.png' );
			break;				
		case Connection.CELL_3G:
			$( '#imgConnection' ).attr( 'src', 'assets/3g.png' );
			break;				
		case Connection.CELL_4G:
			$( '#imgConnection' ).attr( 'src', 'assets/4g.png' );
			break;
		case Connection.NONE:
			$( '#imgConnection' ).attr( 'src', 'assets/none.png' );
			break;								
	}
}