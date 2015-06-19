package comp
{
	import com.greensock.TweenLite;
	
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	
	import images.FatCross;
	
	public class Cross extends Sprite
	{
		private var cross:FatCross = null;
		private var masking:Shape = null;
		
		public function Cross()
		{
			super();
			init();
		}
		
		private function init():void
		{
			masking = new Shape();
			masking.graphics.lineStyle( 1, 0x00FF00, 0 );
			masking.graphics.beginFill( 0x00FF00 );
			masking.graphics.drawRect( 0, 0, 215, 442 );
			masking.graphics.endFill();
			addChild( masking );
			
			cross = new FatCross();
			cross.x = -50;
			cross.mask = masking;
			addChild( cross );
		}
		
		public function hide():void
		{
			TweenLite.to( cross, 0.60, {
				x: -50
			} );
			
			TweenLite.to( masking, 0.60, {
				x: 0,
				width: 216
			} );						
		}		
		
		public function show():void
		{
			TweenLite.to( cross, 0.60, {
				x: 0
			} );
			
			TweenLite.to( masking, 0.60, {
				x: 0,
				width: 310
			} );			
		}
	}
}