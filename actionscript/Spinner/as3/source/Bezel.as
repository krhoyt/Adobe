package
{
	import flash.display.GradientType;
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.geom.Matrix;
	
	public class Bezel extends Sprite
	{
		private var shadow:Shape = null;
		
		public function Bezel()
		{
			super();
			addEventListener( Event.ADDED_TO_STAGE, doAdded );
		}
		
		protected function doAdded( event:Event ):void
		{
			var alphas:Array = [0.25, 0.25, 0.25, 0.25];
			var colors:Array = [0xD4D6E5, 0x989BC6, 0x7577A7, 0x787D9D];
			var ratios:Array = [0x00, 0x7F, 0x7F, 0xFF];
			var matrix:Matrix = new Matrix();
			
			graphics.lineStyle( 1, 0x00FF00, 0 );
			
			graphics.beginFill( 0x80848D );
			graphics.drawRect( 0, 0, 306, 1 );
			graphics.endFill();
			
			matrix.createGradientBox( 306, 53, 90 * ( Math.PI / 180 ) );
			
			graphics.beginGradientFill( GradientType.LINEAR, colors, alphas, ratios, matrix );
			graphics.drawRect( 0, 1, 306, 53 );
			graphics.endFill();
			
			graphics.beginFill( 0x666A83 );
			graphics.drawRect( 0, 54, 306, 1 );
			graphics.endFill();
			
			alphas = [0.10, 0];
			colors = [0x000000, 0x000000];
			ratios = [0x00, 0xFF];
			
			matrix.createGradientBox( 306, 21, 90 * ( Math.PI / 180 ) );
			
			shadow = new Shape();
			shadow.graphics.lineStyle( 1, 0x00FF00, 0 );
			shadow.graphics.beginGradientFill( GradientType.LINEAR, colors, alphas, ratios, matrix );
			shadow.graphics.drawRect( 0, 0, 306, 21 );
			shadow.graphics.endFill();		
			shadow.y = 55;
			addChild( shadow );
		}
	}
}