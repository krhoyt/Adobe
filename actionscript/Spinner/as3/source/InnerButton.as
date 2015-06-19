package
{
	import flash.display.GradientType;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.filters.BitmapFilterQuality;
	import flash.filters.DropShadowFilter;
	import flash.geom.Matrix;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	
	public class InnerButton extends Sprite
	{
		[Embed( systemFont="Helvetica Neue", fontName="HelveticaNew", mimeType="application/x-font", embedAsCFF="false", advancedAntiAliasing="true", fontWeight="bold" )]
		private static var HelveticaNew:Class;		
		
		private var today:TextField = null;
		
		public function InnerButton()
		{
			super();
			addEventListener( Event.ADDED_TO_STAGE, doAdded );
		}
		
		private function redraw( state:String = null ):void
		{
			var alphas:Array = [1, 1];
			var colors:Array = null;
			var ratios:Array = [0x00, 0xFF];
			var matrix:Matrix = new Matrix();			
			
			matrix.createGradientBox( 80, 32, 90 * ( Math.PI / 180 ) );			
			
			graphics.clear();
			
			if( state == null )
			{	
				colors = [0x3F4753, 0x292F36];				
				
				graphics.lineStyle( 1, 0x00FF00, 0 );
				graphics.beginGradientFill( GradientType.LINEAR, colors, alphas, ratios, matrix );
				graphics.drawRoundRect( 0, 0, 80, 32, 8, 8 );
				graphics.endFill();
				
				colors = [0x505A68, 0x353B45];
				matrix.createGradientBox( 78, 30, 90 * ( Math.PI / 180 ) );
				
				graphics.beginGradientFill( GradientType.LINEAR, colors, alphas, ratios, matrix );
				graphics.drawRoundRect( 1, 1, 78, 30, 8, 8 );
				graphics.endFill();										
			} else if( state == "over" ) {
				colors = [0xBEE964, 0x60890E];
				
				graphics.lineStyle( 1, 0x00FF00, 0 );
				graphics.beginGradientFill( GradientType.LINEAR, colors, alphas, ratios, matrix );
				graphics.drawRoundRect( 0, 0, 80, 32, 8, 8 );
				graphics.endFill();
				
				colors = [0x505A68, 0x353B45];
				matrix.createGradientBox( 78, 30, 90 * ( Math.PI / 180 ) );
				
				graphics.beginGradientFill( GradientType.LINEAR, colors, alphas, ratios, matrix );
				graphics.drawRoundRect( 1, 1, 78, 30, 8, 8 );
				graphics.endFill();														
			} else if( state == "down" ) {
				colors = [0xBEE964, 0x60890E];
				
				graphics.lineStyle( 1, 0x00FF00, 0 );
				graphics.beginGradientFill( GradientType.LINEAR, colors, alphas, ratios, matrix );
				graphics.drawRoundRect( 0, 0, 80, 32, 8, 8 );
				graphics.endFill();
				
				colors = [0x353B45, 0x505A68];
				matrix.createGradientBox( 78, 30, 90 * ( Math.PI / 180 ) );
				
				graphics.beginGradientFill( GradientType.LINEAR, colors, alphas, ratios, matrix );
				graphics.drawRoundRect( 1, 1, 78, 30, 8, 8 );
				graphics.endFill();																		
			}
		}
		
		protected function doAdded( event:Event ):void
		{
			today = new TextField();
			today.filters = [new DropShadowFilter( 1, 90, 0x1C242E, 0.80, 0, 0, 1, BitmapFilterQuality.MEDIUM )];
			today.x = 1;
			today.y = 5;
			today.width = 78;
			today.height = 22;
			today.embedFonts = true;
			today.defaultTextFormat = new TextFormat( "HelveticaNew", 13, 0xE6E7E8, true, null, null, null, null, TextFormatAlign.CENTER );
			today.type = TextFieldType.DYNAMIC;
			today.selectable = false;
			today.text = "Today";
			addChild( today );		
			
			redraw();
			
			addEventListener( MouseEvent.MOUSE_OVER, doMouseOver );
			addEventListener( MouseEvent.MOUSE_DOWN, doMouseDown );
			addEventListener( MouseEvent.MOUSE_UP, doMouseUp );
			addEventListener( MouseEvent.MOUSE_OUT, doMouseOut );
		}
		
		protected function doMouseDown( event:MouseEvent ):void
		{
			redraw( "down" );
		}
		
		protected function doMouseOut( event:MouseEvent ):void
		{
			redraw();
		}
		
		protected function doMouseOver( event:MouseEvent ):void
		{
			redraw( "over" );
		}
		
		protected function doMouseUp( event:MouseEvent ):void
		{
			redraw( "over" );
		}
	}
}