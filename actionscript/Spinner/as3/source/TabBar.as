package
{
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.geom.Matrix;
	
	public class TabBar extends Sprite
	{
		private var tabs:Tabs = null;
		
		public function TabBar()
		{
			super();
			addEventListener( Event.ADDED_TO_STAGE, doAdded );
		}
		
		private function layout():void
		{
			var matrix:Matrix = new Matrix();
			
			graphics.lineStyle( 1, 0x00FF00, 0 );
			graphics.beginBitmapFill( new Leather().bitmapData, matrix );
			graphics.drawRect( 0, 0, stage.stageWidth, 64 );
			graphics.endFill();
			
			// tabs.x = Math.round( ( stage.stageWidth - tabs.width ) / 2 );
		}
		
		protected function doAdded( event:Event ):void
		{
			/*
			tabs = new Tabs();
			tabs.y = 17;
			addChild( tabs );
			*/
			
			stage.addEventListener( Event.RESIZE, doStageResize );
			layout();
		}
		
		protected function doStageResize( event:Event ):void
		{
			layout();
		}
	}
}