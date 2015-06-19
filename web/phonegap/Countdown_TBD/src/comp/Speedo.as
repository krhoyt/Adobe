package comp
{
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	import images.Tag;
	
	public class Speedo extends Sprite
	{
		private var borat:Borat = null;
		private var couples:Couples = null;
		private var cross:Cross = null;
		private var ferrell:Ferrell = null;
		private var pictures:Sprite = null;
		private var tag:Tag = null;
		
		public function Speedo()
		{
			super();
			init();
			addEventListener( Event.ADDED_TO_STAGE, doAdded );
		}
		
		private function check( stagex:Number ):void
		{
			if( stagex >= 0 && stagex <= 215 )
			{
				pictures.swapChildrenAt( pictures.getChildIndex( cross ), pictures.numChildren - 1 );
				
				cross.show();				
				borat.hide();				
				couples.hide();				
				ferrell.hide();
			} else if( stagex >= 216 && stagex <= 430 ) {
				pictures.swapChildrenAt( pictures.getChildIndex( borat ), pictures.numChildren - 1 );				
				
				cross.hide();				
				borat.show();				
				couples.hide();				
				ferrell.hide();
			} else if( stagex >= 431 && stagex <= 645 ) {
				pictures.swapChildrenAt( pictures.getChildIndex( couples ), pictures.numChildren - 1 );				
				
				cross.hide();				
				borat.hide();				
				couples.show();				
				ferrell.hide();
			} else if( stagex >= 646 ) {
				pictures.swapChildrenAt( pictures.getChildIndex( ferrell ), pictures.numChildren - 1 );				
				
				cross.hide();				
				borat.hide();				
				couples.hide();				
				ferrell.show();
			}
		}
		
		private function init():void
		{
			pictures = new Sprite();
			addChild( pictures );
			
			cross = new Cross();
			pictures.addChild( cross );
			
			borat = new Borat();
			borat.x = 155;
			pictures.addChild( borat );
			
			couples = new Couples();
			couples.x = 385;
			pictures.addChild( couples );
			
			ferrell = new Ferrell();
			ferrell.x = 575;
			pictures.addChild( ferrell );			
			
			tag = new Tag();
			tag.y = 255;
			addChild( tag );
			
			addEventListener( MouseEvent.MOUSE_DOWN, doMouseDown );			
		}
		
		protected function doAdded( event:Event ):void
		{
			pictures.x = Math.round( ( stage.stageWidth - 854 ) / 2 );
		}
		
		protected function doMouseDown( event:MouseEvent ):void
		{
			addEventListener( MouseEvent.MOUSE_MOVE, doMouseMove );
			addEventListener( MouseEvent.MOUSE_UP, doMouseUp );
		
			check( event.stageX );
		}
		
		protected function doMouseMove( event:MouseEvent ):void
		{
			check( event.stageX );
		}
		
		protected function doMouseUp( event:MouseEvent ):void
		{
			removeEventListener( MouseEvent.MOUSE_MOVE, doMouseMove );
			removeEventListener( MouseEvent.MOUSE_UP, doMouseUp );
			
			cross.hide();
			borat.hide();
			couples.hide();
			ferrell.hide();
		}
	}
}