var polyCount = 0;
var polyBar = null;
var polyHandle = null;

$( document ).ready( function( e ) {

	polyBar = new Image();
	polyBar.onload = doPolyLoaded;
	polyBar.src = 'slider.bar.png';
	
	polyHandle = new Image();
	polyHandle.onload = doPolyLoaded;
	polyHandle.src = 'slider.handle.png';	
	
} );

function doPolyLoaded()
{
	polyCount = polyCount + 1;
	
	if( polyCount == 2 )
	{
		polyInit();
	}
}

function polyInit()
{
	var poly = null;
	var bar = null;
	var border = null;
	var canvas = null;	
	var handle = null;
	var label = null;	
	var stage = null;
	var update = true;	
	var value = null;
	var parts = null;
	
	canvas = document.getElementById( 'poly' );
	stage = new Stage( canvas );

	border = new Shape();
	border.graphics
		.beginFill( '#B5C7D7' )
		.drawRect( 0, 0, 200, 150 )
		.beginFill( '#FFFFFF' )
		.drawRect( 5, 5, 190, 140 );
	border.cache( 0, 0, 200, 150 );

	label = new Text( 'Polygon', '12px Helvetica', '#00417C' );
	label.x = 9;
	label.y = 21;
	
	parts = new Text( 'sides', '11px Helvetica', '#6688AA' );
	parts.x = 53;
	parts.y = 136;	

	bar = new Bitmap( polyBar );
	bar.x = 87;
	bar.y = 130;

	handle = new Bitmap( polyHandle );
	handle.x = 111;
	handle.y = 128;
	handle.onPress = function( e ) {
		var offset = {
			x: handle.x - e.stageX, 
			y: handle.y - e.stageY
		};

		e.onMouseMove = function( ev ) {
			var placement = ev.stageX + offset.x;
			var sides = Math.round( ( ( placement - 78 ) / 76 ) * 9 ) + 2;
			
			if( placement >= 83 && placement <= 159 )
			{
				handle.x = ev.stageX + offset.x;
				poly.graphics
					.clear()
					.beginFill( '#DBE4EB' )
					.setStrokeStyle( 2 )
					.beginStroke( '#6688AA' )
					.drawPolyStar( 100, 67, 50, sides, 0, 0 )
					.endStroke()
					.endFill();
				value.text = sides;

				update = true;				
			}
		};
	};

	value = new Text( '6', '12px Helvetica', '#000000' );
	value.x = 174;
	value.y = 139;

	poly = new Shape();
	poly.graphics
		.beginFill( '#DBE4EB' )
		.setStrokeStyle( 2 )
		.beginStroke( '#6688AA' )
		.drawPolyStar( 100, 67, 50, 6, 0, 0 )
		.endStroke()
		.endFill();
		
	stage.enableMouseOver( 24 );
	stage.addChild( border );
	stage.addChild( label );
	stage.addChild( parts );	
	stage.addChild( bar );
	stage.addChild( value );
	stage.addChild( handle );
	stage.addChild( poly );	
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