var gearCount = 0;
var gearBar = null;
var gearHandle = null;

$( document ).ready( function( e ) {

	gearBar = new Image();
	gearBar.onload = doGearLoaded;
	gearBar.src = 'slider.bar.png';
	
	gearHandle = new Image();
	gearHandle.onload = doGearLoaded;
	gearHandle.src = 'slider.handle.png';	
	
} );

function doGearLoaded()
{
	gearCount = gearCount + 1;
	
	if( gearCount == 2 )
	{
		gearInit();
	}
}

function gearInit()
{
	var gear = null;
	var bar = null;
	var border = null;
	var canvas = null;	
	var handle = null;
	var gear = null;	
	var label = null;	
	var stage = null;
	var update = true;	
	var value = null;
	var parts = null;
	
	canvas = document.getElementById( 'gear' );
	stage = new Stage( canvas );

	border = new Shape();
	border.graphics
		.beginFill( '#B5C7D7' )
		.drawRect( 0, 0, 200, 150 )
		.beginFill( '#FFFFFF' )
		.drawRect( 5, 5, 190, 140 );
	border.cache( 0, 0, 200, 150 );

	label = new Text( 'Gear', '12px Helvetica', '#00417C' );
	label.x = 9;
	label.y = 21;
	
	parts = new Text( 'cogs', '11px Helvetica', '#6688AA' );
	parts.x = 53;
	parts.y = 136;	

	bar = new Bitmap( gearBar );
	bar.x = 87;
	bar.y = 130;

	handle = new Bitmap( gearHandle );
	handle.x = 115;
	handle.y = 128;
	handle.onPress = function( e ) {
		var offset = {
			x: handle.x - e.stageX, 
			y: handle.y - e.stageY
		};

		e.onMouseMove = function( ev ) {
			var placement = ev.stageX + offset.x;
			var sides = Math.round( ( ( placement - 78 ) / 76 ) * 21 ) + 2;
			
			if( placement >= 83 && placement <= 159 )
			{
				handle.x = ev.stageX + offset.x;
				drawGear( gear, 100, 67, sides, 40, 50, 0, 6, 10 );
				value.text = sides;

				update = true;				
			}
		};
	};

	value = new Text( '12', '12px Helvetica', '#000000' );
	value.x = 174;
	value.y = 139;

	gear = new Shape();
	drawGear( gear, 100, 67, 12, 40, 50, 0, 6, 10 );
		
	stage.enableMouseOver( 24 );
	stage.addChild( border );
	stage.addChild( label );
	stage.addChild( parts );	
	stage.addChild( bar );
	stage.addChild( value );
	stage.addChild( handle );
	stage.addChild( gear );	
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