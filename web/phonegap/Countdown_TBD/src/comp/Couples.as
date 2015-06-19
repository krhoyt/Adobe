package comp
{
	import com.greensock.TweenLite;
	
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	
	import images.CouplesRetreat;
	
	public class Couples extends Sprite
	{
		private var couples:CouplesRetreat = null;
		private var masking:Shape = null;
		
		public function Couples()
		{
			super();
			init();
		}
		
		private function init():void
		{
			masking = new Shape();
			masking.x = 45;
			masking.graphics.lineStyle( 1, 0x00FF00, 0 );
			masking.graphics.beginFill( 0x00FF00 );
			masking.graphics.drawRect( 0, 0, 215, 442 );
			masking.graphics.endFill();
			addChild( masking );
			
			couples = new CouplesRetreat();
			couples.mask = masking;
			addChild( couples );
		}
		
		public function hide():void
		{
			TweenLite.to( masking, 0.60, {
				x: 45,
				width: 216
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