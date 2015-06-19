var exif = null;
var reader = null;

$( document ).ready( function() {
	
	$( '#file' ).change( function( list ) {
		if( reader == null ) {
			reader = new FileReader();
			reader.onload = function( evt ) {
				// Other little API tidbits discovered during development
				// alert( 'Changed: ' + this.files[0] );
				// alert( 'Loaded ' + evt.loaded + ' of ' + evt.total );
				// alert( evt.target.result.charCodeAt( 0 ) );
				
				// The power house - parse the image
				exif = new ExifInfo( evt.target.result );
				
				// Clear any existing data
				$( '#output' ).html( '' );
				
				// List out the data
				if( exif.set.primary ) { dump( exif.set.primary, 'Primary' ); }
				if( exif.set.exif ) { dump( exif.set.exif, 'Exif' ); }				
				if( exif.set.gps ) { dump( exif.set.gps, 'GPS' ); }						
				if( exif.set.thumbnail ) { dump( exif.set.thumbnail, 'Thumbnail' ); }												
				if( exif.set.interop ) { dump( exif.set.interop, 'Interoperability' ); }																

				// Show the thumbnail inside the JPEG
				$( '<img src="' + 'data:image/jpeg;base64,' + btoa( exif.thumbnail ) + '"/>' ).appendTo( '#output' );
			};
		}

		// Read the file
		reader.readAsBinaryString( this.files[0] );
	} );
	
} );

// Dumps out IFD set data
function dump( set, name ) 
{
	$( '#output' ).append( '<b>' + name + '</b> (' + set.entries.length + ' entries)<hr/>' );

	for( var p = 0; p < set.entries.length; p++ )
	{
		if( set.entries[p].tag == null )
		{
			$( '#output' ).append( 'Unknown tag: ' + 
				set.entries[p].data +
				'<br/>' );							
		} else {
			$( '#output' ).append( set.entries[p].tag.name + 
				': ' + 
				set.entries[p].data +
				'<br/>' );
		}
	}
	
	$( '#output' ).append( '<br/>' );	
}