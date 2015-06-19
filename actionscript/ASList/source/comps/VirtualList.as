package comps
{
	import com.greensock.TweenNano;
	
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.GestureEvent;
	import flash.events.MouseEvent;
	import flash.events.TouchEvent;
	import flash.events.TransformGestureEvent;
	import flash.geom.Rectangle;
	import renderers.Item;
	
	public class VirtualList extends Sprite
	{
		private var dataProvider:Array = null;
		private var itemRenderer:Class = null;
		private var measuredWidth:Number = 0;
		private var measuredHeight:Number = 0;
		private var paneY:Number = 0;		
		private var rowHeight:Number = -1;
		private var startY:Number = 0;	
		private var pane:Rectangle = null;
		private var holder:Sprite = null;
		
		public function VirtualList( 
			renderer:Class, 
			data:Array = null, 
			rowHeight:Number = 88, 
			width:Number = 640, 
			height:Number = 920 )
		{
			super();
			
			if( data == null )
			{
				dataProvider = new Array();
			} else {
				dataProvider = data;
			}
			
			measuredWidth = width;
			measuredHeight = height;
			
			itemRenderer = renderer;
			
			this.rowHeight = rowHeight;
			
			make();
			fill();
			
			// addEventListener( MouseEvent.MOUSE_DOWN, doTouchBegin );
			addEventListener( TouchEvent.TOUCH_BEGIN, doTouchBegin );
		}
		
		private function fill():void
		{
			var item:Item = null;
			var count:Number = Math.ceil( measuredHeight / rowHeight );
			var index:Number = Math.abs( Math.round( pane.y / rowHeight ) );
			
			for( var i:Number = 0; i < count; i++ )
			{
				item = holder.getChildAt( i ) as Item;
				
				if( index < dataProvider.length )
				{
					item.data = dataProvider[index + i];
				} else {
					item.data = null;
				}
			}			
		}
		
		private function make():void
		{
			var item:Item = null;
			var count:Number = Math.ceil( measuredHeight / rowHeight );
			
			if( holder == null )
			{
				holder = new Sprite();
			} else {
				while( holder.numChildren > 0 )
				{
					holder.removeChildAt( 0 );
				}								
			}
			
			for( var i:Number = 0; i < count; i++ )
			{
				item = new itemRenderer();
				item.y = i * rowHeight;
				holder.addChild( item );
			}
			
			pane = new Rectangle( holder.x, holder.y, measuredWidth, rowHeight * dataProvider.length );
			addChild( holder );
		}
		
		public function setSize( width:Number, height:Number ):void
		{
			measuredWidth = width;
			measuredHeight = height;
			
			make();
			fill();
		}
		
		// protected function doTouchBegin( event:MouseEvent ):void
		protected function doTouchBegin( event:TouchEvent ):void	
		{
			paneY = pane.y;
			startY = event.stageY;
			
			// stage.addEventListener( MouseEvent.MOUSE_MOVE, doTouchMove );
			// stage.addEventListener( MouseEvent.MOUSE_UP, doTouchEnd );
			
			stage.addEventListener( TouchEvent.TOUCH_MOVE, doTouchMove );
			stage.addEventListener( TouchEvent.TOUCH_END, doTouchEnd );			
		}
		
		// protected function doTouchEnd( event:MouseEvent ):void
		protected function doTouchEnd( event:TouchEvent ):void
		{
			// stage.removeEventListener( MouseEvent.MOUSE_MOVE, doTouchMove );
			// stage.removeEventListener( MouseEvent.MOUSE_UP, doTouchEnd );
			
			stage.removeEventListener( TouchEvent.TOUCH_MOVE, doTouchMove );
			stage.removeEventListener( TouchEvent.TOUCH_END, doTouchEnd );			

			paneY = 0;
			startY = 0;
		}
		
		// protected function doTouchMove( event:MouseEvent ):void
		protected function doTouchMove( event:TouchEvent ):void
		{
			var delta:Number = paneY + ( event.stageY - startY );
			var total:Number = Math.abs( delta ) + measuredHeight;
			
			if( delta > 0 )
			{
				pane.y = 0;

				paneY = pane.y;
				startY = event.stageY;
			} else if( total > pane.height ) {
				pane.y = 0 - ( pane.height - measuredHeight );
				
				paneY = pane.y;
				startY = event.stageY;				
			} else {
				pane.y = delta;
			}

			fill();
		}
	}
}