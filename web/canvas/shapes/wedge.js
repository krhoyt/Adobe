var wedgeCount = 0;
var wedgeBar = null;
var wedgeHandle = null;

$( document ).ready( function( e ) {

	wedgeBar = new Image();
	wedgeBar.onload = doWedgeLoaded;
	wedgeBar.src = 'slider.tick.png';
	
	wedgeHandle = new Image();
	wedgeHandle.onload = doWedgeLoaded;
	wedgeHandle.src = 'slider.handle.png';	
	
} );

function doWedgeLoaded()
{
	wedgeCount = wedgeCount + 1;
	
	if( wedgeCount == 2 )
	{
		wedgeInit();
	}
}

function wedgeInit()
{
	var bar = null;
	var border = null;
	var canvas = null;	
	var handle = null;
	var label = null;	
	var stage = null;
	var update = true;	
	var value = null;
	var wedge = null;	
	var parts = null;
	
	canvas = document.getElementById( 'wedge' );
	stage = new Stage( canvas );

	border = new Shape();
	border.graphics
		.beginFill( '#B5C7D7' )
		.drawRect( 0, 0, 200, 150 )
		.beginFill( '#FFFFFF' )
		.drawRect( 5, 5, 190, 140 );
	border.cache( 0, 0, 200, 150 );

	label = new Text( 'Wedge', '12px Helvetica', '#00417C' );
	label.x = 9;
	label.y = 21;
	
	parts = new Text( 'arc', '11px Helvetica', '#6688AA' );
	parts.x = 17;
	parts.y = 136;	

	bar = new Bitmap( wedgeBar );
	bar.x = 41;
	bar.y = 130;

	handle = new Bitmap( wedgeHandle );
	handle.x = 58;
	handle.y = 128;
	handle.onPress = function( e ) {
		var offset = {
			x: handle.x - e.stageX, 
			y: handle.y - e.stageY
		};

		e.onMouseMove = function( ev ) {
			var placement = ev.stageX + offset.x;
			var degrees = ( ( placement - 37 ) / 116 ) * 360;
			
			if( placement >= 37 && placement <= 153 )
			{
				handle.x = ev.stageX + offset.x;
				drawWedge( wedge, 100, 67, 0, degrees, 50, 50 );

				/*
				wedge.graphics
					.clear()
					.beginFill( '#DBE4EB' )
					.setStrokeStyle( 2 )
					.beginStroke( '#6688AA' )
					.moveTo( 100, 67 )
					.lineTo( 150, 67 )
					.arc( 100, 67, 50, 0, degrees * ( Math.PI / 180 ) )
					.lineTo( 100, 67 )
					.endStroke()
					.closePath()
					.endFill();
				*/
	
				value.text = Math.floor( degrees );

				update = true;				
			}
		};
	};

	value = new Text( '65', '12px Helvetica', '#000000' );
	value.x = 168;
	value.y = 139;

	wedge = new Shape();
	drawWedge( wedge, 100, 67, 0, 65, 50, 50 );
	
	/*
	wedge.graphics
		.beginFill( '#DBE4EB' )
		.setStrokeStyle( 2 )
		.beginStroke( '#6688AA' )
		.moveTo( 100, 67 )
		.lineTo( 150, 67 )
		.arc( 100, 67, 50, 0, 65 * ( Math.PI / 180 ) )
		.lineTo( 100, 67 )
		.endStroke()
		.closePath()
		.endFill();
	*/
	
	stage.enableMouseOver( 24 );
	stage.addChild( border );
	stage.addChild( label );
	stage.addChild( parts );	
	stage.addChild( bar );
	stage.addChild( value );
	stage.addChild( handle );
	stage.addChild( wedge );	
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
}