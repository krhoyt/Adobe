$( document ).ready( function( e ) {
	var border = null;
	var canvas = null;	
	var dashes = null;
	var label = null;	
	var lhandle = null;
	var rhandle = null;
	var stage = null;
	var update = true;	
	
	canvas = document.getElementById( 'dashes' );
	stage = new Stage( canvas );

	border = new Shape();
	border.graphics
		.beginFill( '#B5C7D7' )
		.drawRect( 0, 0, 200, 150 )
		.beginFill( '#FFFFFF' )
		.drawRect( 5, 5, 190, 140 );
	border.cache( 0, 0, 200, 150 );

	label = new Text( 'Dashed Line', '12px Helvetica', '#00417C' );
	label.x = 9;
	label.y = 21;

	lhandle = new Shape();
	lhandle.x = 31;
	lhandle.y = 71;
	lhandle.graphics
		.beginFill( '#797979' )
		.drawRect( 0, 0, 9, 8 )
		.beginFill( '#D6D6D6' )
		.drawRect( 1, 1, 7, 6 );
	lhandle.onPress = function( e ) {
		var offset = {
			x: lhandle.x - e.stageX, 
			y: lhandle.y - e.stageY
		};
		
		e.onMouseMove = function( ev ) {
			lhandle.x = ev.stageX + offset.x;
			lhandle.y = ev.stageY + offset.y;
			
			dashTo( dashes, lhandle.x + 4, lhandle.y + 4, rhandle.x + 4, rhandle.y + 4, 6, 7 );
			
			update = true;
		};
	};
		
	rhandle = new Shape();
	rhandle.x = 161;
	rhandle.y = 71;
	rhandle.graphics
		.beginFill( '#797979' )
		.drawRect( 0, 0, 9, 8 )
		.beginFill( '#D6D6D6' )
		.drawRect( 1, 1, 7, 6 );
	rhandle.onPress = function( e ) {
		var offset = {
			x: rhandle.x - e.stageX, 
			y: rhandle.y - e.stageY
		};
		
		e.onMouseMove = function( ev ) {
			rhandle.x = ev.stageX + offset.x;
			rhandle.y = ev.stageY + offset.y;
	
			dashTo( dashes, lhandle.x + 4, lhandle.y + 4, rhandle.x + 4, rhandle.y + 4, 6, 7 );
	
			update = true;
		};
	};

	dashes = new Shape();
	dashTo( dashes, lhandle.x + 4, lhandle.y + 4, rhandle.x + 4, rhandle.y + 4, 6, 7 );
	
	stage.enableMouseOver( 24 );
	stage.addChild( border );
	stage.addChild( label );
	stage.addChild( lhandle );
	stage.addChild( rhandle );
	stage.addChild( dashes );	
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