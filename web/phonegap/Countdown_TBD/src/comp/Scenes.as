package comp
{
	import com.greensock.TweenLite;
	
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.events.TransformGestureEvent;
	
	import images.Cayman;
	import images.Cigars;
	import images.Cozumel;
	import images.Drink;
	import images.Fish;
	import images.Montego;
	import images.Turtle;
	
	public class Scenes extends Sprite
	{
		private var cayman:Cayman = null;
		private var cigars:Cigars = null;
		private var cozumel:Cozumel = null;
		private var drink:Drink = null;
		private var fish:Fish = null;
		private var montego:Montego = null;
		private var day:Number = 0;
		private var turtle:Turtle = null;
		
		public function Scenes()
		{
			super();
			init();
		}
		
		private function init():void
		{
			// Click for desktop testing
			// addEventListener( MouseEvent.CLICK, doClick );			
			addEventListener( TransformGestureEvent.GESTURE_SWIPE, doSwipe );
			
			montego = new Montego();
			addChild( montego );
			
			cayman = new Cayman();
			addChild( cayman );
			
			cozumel = new Cozumel();
			addChild( cozumel );
			
			fish = new Fish();
			addChild( fish );

			drink = new Drink();
			addChild( drink );
			
			turtle = new Turtle();
			addChild( turtle );
			
			cigars = new Cigars();
			addChild( cigars );
			
			day = Math.floor( Math.random() * numChildren );
			doComplete();

		}
		
		public function next():void
		{
			var current:DisplayObject = getChildAt( day );
			
			if( day == ( numChildren - 1 ) )
			{
				day = 0;
			} else {
				day = day + 1;
			}

			getChildAt( day ).x = 854;
			getChildAt( day ).visible = true;
			
			TweenLite.to( current, 0.80, {
				x: -854,
				onComplete: doComplete
			} );
			
			TweenLite.to( getChildAt( day ), 0.80, {
				x: 0
			} );
		}
		
		public function previous():void
		{
			var current:DisplayObject = getChildAt( day );
			
			if( day == 0 )
			{
				day = ( numChildren - 1 );
			} else {
				day = day - 1;
			}
			
			getChildAt( day ).x = -854;
			getChildAt( day ).visible = true;
			
			TweenLite.to( current, 0.80, {
				x: 854,
				onComplete: doComplete
			} );
			
			TweenLite.to( getChildAt( day ), 0.80, {
				x: 0
			} );
		}
		
		protected function doClick( event:MouseEvent ):void
		{
			if( event.stageX > 427 )
			{
				next();
			} else {
				previous();
			}
		}		
		
		protected function doComplete():void
		{
			for( var d:Number = 0; d < numChildren; d++ )
			{
				if( d != day )
				{
					getChildAt( d ).visible = false;
				}
			}
		}
		
		protected function doSwipe( event:TransformGestureEvent ):void
		{
			if( event.offsetX == -1 )
			{
				// Left				
				next();
			} else {
				// Right
				previous();
			}
		}		
	}
}