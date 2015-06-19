package comps
{
	import com.greensock.TweenLite;
	import com.greensock.TweenNano;
	
	import flash.display.DisplayObject;
	import flash.display.Shape;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.events.TouchEvent;
	import flash.geom.Rectangle;
	
	import renderers.Item;
	
	public class SmoothList extends Sprite
	{
		private var dataProvider:Array = null;
		private var itemRenderer:Class = null;
		private var measuredWidth:Number = 0;
		private var measuredHeight:Number = 0;
		private var paneY:Number = 0;
		private var rowHeight:Number = -1;
		private var startY:Number = 0;
		private var pane:Rectangle = null;
		private var scrollbar:Sprite = null;
		private var masking:Shape = null;
		private var holder:Sprite = null;		
		
		public function SmoothList(			
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
			
			addEventListener( MouseEvent.MOUSE_DOWN, doTouchBegin );
			// addEventListener( TouchEvent.TOUCH_BEGIN, doTouchBegin );
		}
		
		private function fill():void
		{			
			var item:Item = null;
			var count:Number = Math.ceil( measuredHeight / rowHeight );
			var index:Number = Math.abs( Math.ceil( pane.y / rowHeight ) );
			var steps:Number = 0;
			
			count = count + 2;
			holder.y = pane.y % rowHeight;
			
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
			
			steps = ( measuredHeight - scrollbar.height ) / ( pane.height - measuredHeight );
			scrollbar.y = Math.abs( pane.y ) * steps;
		}		
		
		private function make():void
		{
			var item:Item = null;
			var count:Number = Math.ceil( measuredHeight / rowHeight );		
			var percent:Number = 0;
			
			if( holder == null )
			{
				pane = new Rectangle( 0, 0, measuredWidth, dataProvider.length * rowHeight );				
				
				holder = new Sprite();
				addChild( holder );
			} else {
				while( holder.numChildren > 0 )
				{
					holder.removeChildAt( 0 );
				}								
			}
			
			for( var i:Number = 0; i < ( count + 2 ); i++ )
			{
				item = new itemRenderer();
				item.y = i * rowHeight;
				holder.addChild( item );
			}

			if( scrollbar == null )
			{
				scrollbar = new Sprite();
				addChild( scrollbar );
			}
			
			percent = measuredHeight / ( rowHeight * dataProvider.length );
			
			if( percent >= 1 )
			{
				scrollbar.visible = false;
				scrollbar.alpha = 0;
			} else {
				scrollbar.visible = true;
				scrollbar.alpha = 0;
				
				percent = Math.round( percent * measuredHeight );

				if( percent < rowHeight )
				{
					percent = rowHeight;
				}
				
				scrollbar.graphics.clear();
				scrollbar.graphics.lineStyle( 1, 0x00FF00, 0 );
				scrollbar.graphics.beginFill( 0xBDBABD );
				scrollbar.graphics.drawCircle( 3, 3, 3 );
				scrollbar.graphics.endFill();
				scrollbar.graphics.beginFill( 0xBDBABD );
				scrollbar.graphics.drawRect( 0, 3, 6, percent - 6 );
				scrollbar.graphics.endFill();			
				scrollbar.graphics.beginFill( 0xBDBABD );
				scrollbar.graphics.drawCircle( 3, percent - 3, 3 );
				scrollbar.graphics.endFill();
				scrollbar.x = measuredWidth - 7;				
			}
				
			if( masking == null )
			{
				masking = new Shape();
				addChild( masking );				
			}
			
			masking.graphics.lineStyle( 1, 0x00FF00, 0 );
			masking.graphics.beginFill( 0xFF0000, 1 );
			masking.graphics.drawRect( 0, 0, measuredWidth, measuredHeight );			
			
			mask = masking;
		}		
		
		protected function doTouchBegin( event:MouseEvent ):void
		// protected function doTouchBegin( event:TouchEvent ):void
		{
			paneY = pane.y;
			startY = event.stageY;
			
			stage.addEventListener( MouseEvent.MOUSE_MOVE, doTouchMove );
			stage.addEventListener( MouseEvent.MOUSE_UP, doTouchEnd );
			
			// stage.addEventListener( TouchEvent.TOUCH_MOVE, doTouchMove );
			// stage.addEventListener( TouchEvent.TOUCH_END, doTouchEnd );
			
			TweenNano.to( scrollbar, 0.60, {
				alpha: 1
			} );			
		}		
		
		protected function doTouchEnd( event:MouseEvent ):void
		// protected function doTouchEnd( event:TouchEvent ):void
		{
			stage.removeEventListener( MouseEvent.MOUSE_MOVE, doTouchMove );
			stage.removeEventListener( MouseEvent.MOUSE_UP, doTouchEnd );
			
			// stage.removeEventListener( TouchEvent.TOUCH_MOVE, doTouchMove );
			// stage.removeEventListener( TouchEvent.TOUCH_END, doTouchEnd );			
		
			TweenNano.to( scrollbar, 0.60, {
				alpha: 0
			} );				
			
			paneY = 0;
			startY = 0;			
		}
		
		protected function doTouchMove( event:MouseEvent ):void
		// protected function doTouchMove( event:TouchEvent ):void
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