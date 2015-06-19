$( document ).ready( function( e ) {
	var border = null;
	var canvas = null;	
	var oval = null;
	var label = null;	
	var handle = null;
	var stage = null;
	var update = true;	
	
	canvas = document.getElementById( 'oval' );
	stage = new Stage( canvas );

	border = new Shape();
	border.graphics
		.beginFill( '#B5C7D7' )
		.drawRect( 0, 0, 200, 150 )
		.beginFill( '#FFFFFF' )
		.drawRect( 5, 5, 190, 140 );
	border.cache( 0, 0, 200, 150 );

	label = new Text( 'Oval', '12px Helvetica', '#00417C' );
	label.x = 9;
	label.y = 21;

	handle = new Shape();
	handle.x = 146;
	handle.y = 71;
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
			var w = 0;
	
			handle.x = ev.stageX + offset.x;
			
			w = ( handle.x - 100 + 4 ) * 2;
			
			oval.graphics
				.clear()
				.setStrokeStyle( 2 )
				.beginFill( '#DBE4EB' )
				.beginStroke( '#6688AA' )
				.drawEllipse( ( 200 - w ) / 2, ( 150 - 66 ) / 2, w, 66 )
				.endStroke()
				.endFill();	
						
			update = true;							
		};
	};

	oval = new Shape();
	oval.graphics
		.setStrokeStyle( 2 )
		.beginFill( '#DBE4EB' )
		.beginStroke( '#6688AA' )
		.drawEllipse( 50, 42, 100, 66 )
		.endStroke()
		.endFill();
	
	stage.enableMouseOver( 24 );
	stage.addChild( border );
	stage.addChild( label );
	stage.addChild( handle );
	stage.addChild( oval );	
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