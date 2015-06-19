package comp
{
	import com.greensock.TweenLite;
	
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	
	import images.GreenBorat;
	
	public class Borat extends Sprite
	{
		private var borat:GreenBorat = null;
		private var masking:Shape = null;
		
		public function Borat()
		{
			super();
			init();
		}
		
		private function init():void
		{
			masking = new Shape();
			masking.x = 60;
			masking.graphics.lineStyle( 1, 0x00FF00, 0 );
			masking.graphics.beginFill( 0x00FF00 );
			masking.graphics.drawRect( 0, 0, 215, 442 );
			masking.graphics.endFill();
			addChild( masking );
			
			borat = new GreenBorat();
			borat.mask = masking;
			addChild( borat );
		}
		
		public function hide():void
		{
			TweenLite.to( masking, 0.60, {
				x: 60,
				width: 217
			} );						
		}
		
		public function show():void
		{
			TweenLite.to( masking, 0.60, {
				x: 0,
				width: 310
			} );			
		}
	}
}