package
{
	import flash.display.GradientType;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.filters.BitmapFilterQuality;
	import flash.filters.DropShadowFilter;
	import flash.filters.GlowFilter;
	import flash.geom.Matrix;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	import flash.text.TextFormatAlign;
	
	public class OuterButton extends Sprite
	{
		[Embed( systemFont="Helvetica Neue", fontName="HelveticaNew", mimeType="application/x-font", embedAsCFF="false", advancedAntiAliasing="true", fontWeight="bold" )]
		private static var HelveticaNew:Class;				
		
		private var _enabled:Boolean = true;
		private var label:TextField = null;
		
		public function OuterButton()
		{
			super();
			addEventListener( Event.ADDED_TO_STAGE, doAdded );			
		}
		
		private function redraw( state:String = null ):void
		{
			var alphas:Array = [1, 1];
			var colors:Array = [0x50CFF6, 0x176F8D];
			var ratios:Array = [0x00, 0xFF];
			var matrix:Matrix = new Matrix();			
			
			graphics.clear();
			matrix.createGradientBox( 80, 32, 90 * ( Math.PI / 180 ) );			
			
			if( !enabled )
			{
				graphics.lineStyle( 1, 0x00FF00, 0 );
				graphics.beginGradientFill( GradientType.LINEAR, colors, alphas, ratios, matrix );
				graphics.drawRoundRect( 0, 0, 170, 32, 8, 8 );
				graphics.endFill();				
				
				return;
			}
			
			if( state == null )
			{
				graphics.lineStyle( 1, 0x00FF00, 0 );
				graphics.beginGradientFill( GradientType.LINEAR, colors, alphas, ratios, matrix );
				graphics.drawRoundRect( 0, 0, 170, 32, 8, 8 );
				graphics.endFill();				
			} else {
				colors = [0x176F8D, 0x50CFF6];				
				
				graphics.lineStyle( 1, 0x00FF00, 0 );
				graphics.beginGradientFill( GradientType.LINEAR, colors, alphas, ratios, matrix );
				graphics.drawRoundRect( 0, 0, 170, 32, 8, 8 );
				graphics.endFill();								
			}
		}
		
		protected function doAdded( event:Event ):void
		{
			redraw();
			
			filters = [new GlowFilter( 0x000000, 0.60, 4, 4, 1, BitmapFilterQuality.MEDIUM )];
			
			label = new TextField();
			label.x = 12;
			label.y = 6;
			label.width = 145;
			label.height = 22;
			label.embedFonts = true;
			label.defaultTextFormat = new TextFormat( "HelveticaNew", 13, 0xE6E7E8, true, null, null, null, null, TextFormatAlign.CENTER );
			label.type = TextFieldType.DYNAMIC;
			label.selectable = false;
			label.text = "GENERATE REPORT";
			addChild( label );
			
			addEventListener( MouseEvent.MOUSE_OVER, doMouseOver );
			addEventListener( MouseEvent.MOUSE_OUT, doMouseOut );
			addEventListener( MouseEvent.MOUSE_DOWN, doMouseDown );
			addEventListener( MouseEvent.MOUSE_UP, doMouseUp );
		}
		
		protected function doMouseDown( event:MouseEvent ):void
		{
			redraw( "down" );
		}				
		
		protected function doMouseOut( event:MouseEvent ):void
		{
			if( enabled )
			{
				filters = [new GlowFilter( 0x000000, 0.60, 4, 4, 1, BitmapFilterQuality.MEDIUM )];
			}			
		}		
		
		protected function doMouseOver( event:MouseEvent ):void
		{
			if( enabled )
			{
				filters = [new GlowFilter( 0xBEE964, 0.60, 4, 4, 1, BitmapFilterQuality.MEDIUM )];
			}			
		}
		
		protected function doMouseUp( event:MouseEvent ):void
		{
			redraw();
		}
		
		public function get enabled():Boolean 
		{
			return _enabled;
		}
		
		public function set enabled( value:Boolean ):void
		{
			_enabled = value;
			
			if( value )
			{
				alpha = 1;
			} else {
				alpha = 0.50;
			}
			
			redraw();
		}
	}
}