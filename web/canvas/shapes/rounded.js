$( document ).ready( function( e ) {
	var border = null;
	var canvas = null;	
	var label = null;	
	var handle = null;
	var rounded = null;	
	var stage = null;
	var update = true;	
	
	canvas = document.getElementById( 'rounded' );
	stage = new Stage( canvas );

	border = new Shape();
	border.graphics
		.beginFill( '#B5C7D7' )
		.drawRect( 0, 0, 200, 150 )
		.beginFill( '#FFFFFF' )
		.drawRect( 5, 5, 190, 140 );
	border.cache( 0, 0, 200, 150 );

	label = new Text( 'Rounded Rectangle', '12px Helvetica', '#00417C' );
	label.x = 9;
	label.y = 21;

	handle = new Shape();
	handle.x = 146;
	handle.y = 123;
	handle.graphics
		.beginFill( '#797979' )
		.drawRect( 0, 0, 9, 8 )
		.beginFill( '#D6D6D6' )
		.drawRect( 1, 1, 7, 6 );
	handle.onPress = function( e ) {
		var offset = {
			x: handle.x - e.stageX, 
			y: handle.y - e.stageY
		};
		
		e.onMouseMove = function( ev ) {
			var h = 0;
			var w = 0;
	
			handle.x = ev.stageX + offset.x;
			handle.y = ev.stageY + offset.y;
			
			w = ( handle.x - 100 + 4 ) * 2;
			h = ( handle.y - 83 + 4 ) * 2;
			
			rounded.graphics
				.clear()
				.setStrokeStyle( 2 )
				.beginFill( '#DBE4EB' )
				.beginStroke( '#6688AA' )
				.drawRoundRect( ( 200 - w ) / 2, ( ( 124 - h ) / 2 ) + 21, w, h, 15 )
				.endStroke()
				.endFill();	
						
				// .drawEllipse( ( 200 - w ) / 2, ( 150 - 66 ) / 2, w, 66 )						
						
			update = true;							
		};
	};

	rounded = new Shape();
	rounded.graphics
		.setStrokeStyle( 2 )
		.beginFill( '#DBE4EB' )
		.beginStroke( '#6688AA' )
		.drawRoundRect( 50, 39, 100, 88, 15 )
		.endStroke()
		.endFill();
	
	stage.enableMouseOver( 24 );
	stage.addChild( border );
	stage.addChild( label );
	stage.addChild( handle );
	stage.addChild( rounded );	
	stage.addChild( handle );	
	stage.update();
	
	Ticker.addListener( {
		tick: function() {
			if( update )
			{
				update = false;
				stage.update();
			}
		} 
	} );
} );