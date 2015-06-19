var SOURCE = 'phrase.wav';

var phrase = 0;
var loaded = 0;

document.addEventListener( 'deviceready', function() {
	var media = null;
	var reference = null;

	window.requestFileSystem(
		LocalFileSystem.PERSISTENT, 
		0, 
		function doAccess( fs ) {
			// alert( 'Got file access' );
			
			fs.root.getFile( 
				SOURCE,
				{
					create: true,
					exclusive: false	
				},
				function( fe ) {
					reference = fe.fullPath;
					fe.createWriter( 
						function( writer ) {
							// alert( 'Ready to write' );
							
							writer.onwriteend = function( e ) {
								// alert( 'File written' );
							};
							
							writer.write( ' ' );
						}
					);
				}, 
				function( err ) {
					// alert( 'No access to file entry' );
				}
			);
		}, 
		function( err ) {
			// alert( 'File system not responding' );	
		}
	);

	$( '#record' )
	.bind( 'touchstart', function( e ) {
		if( media == null )
		{
			$( this ).attr( 'src', 'assets/record.down.png' );			
		} else {
			$( this ).attr( 'src', 'assets/stop.down.png' );			
		}
	} )
	.bind( 'touchend', function( e ) { 
		$( this ).attr( 'src', 'assets/stop.up.png' );
			
		if( media == null )
		{
			media = new Media( reference, function() {
				// alert( 'Got media' );
			}, function( err ) {
				// alert( 'Problems accessing media' );
			} );
			
			media.startRecord();			
		} else {
			media.stopRecord();
			media.release();
			media = null;
				
			$( this ).attr( 'src', 'assets/record.up.png' );
		}
	} );
	
	$( '#play' )
	.bind( 'touchstart', function( e ) {
		if( media == null ) 
		{
			$( this ).attr( 'src', 'assets/play.down.png' );
		} else {
			$( this ).attr( 'src', 'assets/stop.down.png' );			
		}
	} )
	.bind( 'touchend', function( e ) {
		if( media == null )
		{
			$( this ).attr( 'src', 'assets/stop.up.png' );
			
			media = new Media( reference, function() {
				media.release();
				media = null;
						
				$( '#play' ).attr( 'src', 'assets/play.up.png' );
			}, function() {
				// alert( 'Problems accessing audio' );
			} );
				
			media.play();
		} else {
			$( this ).attr( 'src', 'assets/play.up.png' );	
			
			media.stop();
			media.release();
			media = null;
		}
	
	} );
	
	$( '#translate' ).bind( 'touchstart', function( e ) {
		var phrases = [
			'1-great-presentation.mp3',
			'2-really-liked.mp3',
			'3-really-amazing.mp3',
			'4-dirty-thoughts.mp3',
			'5-have-baby.mp3'
		];
		
		$( '#response' ).empty();
		$( '<source>' )
			.attr( 'src', 'phrases/' + phrases[phrase] )
			.appendTo( '#response' );
		loaded = 0;
		document.getElementById( 'response' ).load();	
				
		if( phrase == 4 )
		{
			phrase = 0;	
		} else {
			phrase = phrase + 1;
		}				
	} );
	
	$( '#response' ).bind( 'progress', function( e ) {
		var audio = document.getElementById( 'response' );
 		var duration = audio.duration;
		var end = audio.buffered.end( 0 );
		
		// Progress gets fired twice
		// Only want to play once
		if( loaded < 100 )
		{
			loaded = parseInt( ( ( end / duration ) * 100 ) )
	 		// console.log( loaded );	
		
			if( loaded == 100 )
			{
				document.getElementById( 'response' ).play();			
			}			
		}
	} );
	
	$( '#uncle' ).bind( 'touchend', function( e ) {
		navigator.notification.confirm( 
			'Are you sure you are done?',
			function( button ) {
				// alert( 'Success: ' + button );
			},
			'Question For You',
			'Yes,No,Bugger Off'
		);
	} );

}, false );