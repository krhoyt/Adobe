var burstCount = 0;
var burstBar = null;
var burstHandle = null;

$( document ).ready( function( e ) {

	burstBar = new Image();
	burstBar.onload = doBurstLoaded;
	burstBar.src = 'slider.bar.png';
	
	burstHandle = new Image();
	burstHandle.onload = doBurstLoaded;
	burstHandle.src = 'slider.handle.png';	
	
} );

function doBurstLoaded()
{
	burstCount = burstCount + 1;
	
	if( burstCount == 2 )
	{
		burstInit();
	}
}

function burstInit()
{
	var burst = null;
	var bar = null;
	var border = null;
	var canvas = null;	
	var handle = null;
	var label = null;	
	var stage = null;
	var update = true;	
	var value = null;
	var parts = null;
	
	canvas = document.getElementById( 'burst' );
	stage = new Stage( canvas );

	border = new Shape();
	border.graphics
		.beginFill( '#B5C7D7' )
		.drawRect( 0, 0, 200, 150 )
		.beginFill( '#FFFFFF' )
		.drawRect( 5, 5, 190, 140 );
	border.cache( 0, 0, 200, 150 );

	label = new Text( 'Burst', '12px Helvetica', '#00417C' );
	label.x = 9;
	label.y = 21;
	
	parts = new Text( 'sides', '11px Helvetica', '#6688AA' );
	parts.x = 53;
	parts.y = 136;	

	bar = new Bitmap( burstBar );
	bar.x = 87;
	bar.y = 130;

	handle = new Bitmap( burstHandle );
	handle.x = 128;
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
				drawBurst( burst, 100, 67, sides, 25, 50, 90 );
				value.text = sides;

				update = true;				
			}
		};
	};

	value = new Text( '8', '12px Helvetica', '#000000' );
	value.x = 174;
	value.y = 139;

	burst = new Shape();
	drawBurst( burst, 100, 67, 8, 25, 50, 90 );
		
	stage.enableMouseOver( 24 );
	stage.addChild( border );
	stage.addChild( label );
	stage.addChild( parts );	
	stage.addChild( bar );
	stage.addChild( value );
	stage.addChild( handle );
	stage.addChild( burst );	
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