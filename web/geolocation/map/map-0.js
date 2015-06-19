var map = null;
var watching = null;

function doLoad()
{
	map = new google.maps.Map( document.getElementById( 'map' ), {
          center: new google.maps.LatLng( -34.397, 150.644 ),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP		
	} );	
	
	google.maps.event.addListener( map, 'tilesloaded', doMapLoaded );	
}

function doMapLoaded( evt )
{

}

function doPositionError( error )
{
	console.log( 'Get error: ' + error.message );	
}

function doPositionSuccess( position )
{

}

function doWatchError( error )
{
	console.log( 'Watch error: ' + error.message );	
}

function doWatchSuccess( position )
{

}