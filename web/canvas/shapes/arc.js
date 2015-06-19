var arcCount = 0;
var arcBar = null;
var arcHandle = null;

$( document ).ready( function( e ) {

	arcBar = new Image();
	arcBar.onload = doArcLoaded;
	arcBar.src = 'slider.tick.png';
	
	arcHandle = new Image();
	arcHandle.onload = doArcLoaded;
	arcHandle.src = 'slider.handle.png';	
	
} );

function doArcLoaded()
{
	arcCount = arcCount + 1;
	
	if( arcCount == 2 )
	{
		arcInit();
	}
}

function arcInit()
{
	var arc = null;
	var bar = null;
	var border = null;
	var canvas = null;	
	var handle = null;
	var label = null;	
	var stage = null;
	var update = true;	
	var value = null;
	var parts = null;
	
	canvas = document.getElementById( 'arc' );
	stage = new Stage( canvas );

	border = new Shape();
	border.graphics
		.beginFill( '#B5C7D7' )
		.drawRect( 0, 0, 200, 150 )
		.beginFill( '#FFFFFF' )
		.drawRect( 5, 5, 190, 140 );
	border.cache( 0, 0, 200, 150 );

	label = new Text( 'Arc', '12px Helvetica', '#00417C' );
	label.x = 9;
	label.y = 21;
	
	parts = new Text( 'arc', '11px Helvetica', '#6688AA' );
	parts.x = 17;
	parts.y = 136;	

	bar = new Bitmap( arcBar );
	bar.x = 41;
	bar.y = 130;

	handle = new Bitmap( arcHandle );
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

				arc.graphics
					.clear()
					.setStrokeStyle( 2 )
					.beginStroke( '#6688AA' )
					.arc( 100, 67, 50, 0, degrees * ( Math.PI / 180 ) )
					.endStroke();			
				value.text = Math.floor( degrees );

				update = true;				
			}
		};
	};

	value = new Text( '65', '12px Helvetica', '#000000' );
	value.x = 168;
	value.y = 139;

	arc = new Shape();
	arc.graphics
		.setStrokeStyle( 2 )
		.beginStroke( '#6688AA' )
		.arc( 100, 67, 50, 0, 65 * ( Math.PI / 180 ) )
		.endStroke();
	
	stage.enableMouseOver( 24 );
	stage.addChild( border );
	stage.addChild( label );
	stage.addChild( parts );	
	stage.addChild( bar );
	stage.addChild( value );
	stage.addChild( handle );
	stage.addChild( arc );	
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