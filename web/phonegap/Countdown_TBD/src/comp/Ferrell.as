package comp
{
	import com.greensock.TweenLite;
	
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	
	import images.WillFerrell;
	
	public class Ferrell extends Sprite
	{
		private var ferrell:WillFerrell = null;
		private var masking:Shape = null;
		
		public function Ferrell()
		{
			super();
			init();
		}
		
		private function init():void
		{
			masking = new Shape();
			masking.x = 70;
			masking.graphics.lineStyle( 1, 0x00FF00, 0 );
			masking.graphics.beginFill( 0x00FF00 );
			masking.graphics.drawRect( 0, 0, 215, 442 );
			masking.graphics.endFill();
			addChild( masking );
			
			ferrell = new WillFerrell();
			ferrell.mask = masking;
			addChild( ferrell );
		}
		
		public function hide():void
		{
			TweenLite.to( masking, 0.60, {
				x: 70,
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