package comp
{
	import com.greensock.TweenLite;
	
	import events.MenuEvent;
	
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.events.MouseEvent;
	import flash.ui.Keyboard;
	
	public class Menu extends Sprite
	{
		private var disable:DisableButton = null;
		private var enable:EnableButton = null;
		
		public function Menu()
		{
			super();
			init();
			addEventListener( Event.ADDED_TO_STAGE, doAdded );
		}
		
		private function init():void
		{
			disable = new DisableButton();
			disable.visible = false;
			disable.addEventListener( MouseEvent.CLICK, doDisableClick );
			addChild( disable );
			
			enable = new EnableButton();
			enable.addEventListener( MouseEvent.CLICK, doEnableClick );
			addChild( enable );
			
			y = 442;
		}
		
		protected function doAdded( event:Event ):void
		{
			stage.addEventListener( KeyboardEvent.KEY_DOWN, doKeyDown );
			
			x = Math.round( ( stage.stageWidth - 854 ) / 2 );
		}
		
		protected function doDisableClick( event:MouseEvent ):void
		{
			dispatchEvent( new MenuEvent( MenuEvent.SPEEDO_DISABLE ) );
			
			TweenLite.to( this, 0.60, {
				y: 442,
				onComplete: doDisableComplete
			} );
		}
		
		protected function doDisableComplete():void
		{
			enable.visible = true;
			disable.visible = false;
		}		
		
		protected function doEnableClick( event:MouseEvent ):void
		{
			dispatchEvent( new MenuEvent( MenuEvent.SPEEDO_ENABLE ) );
			
			TweenLite.to( this, 0.60, {
				y: 442,
				onComplete: doEnableComplete
			} );
		}
		
		protected function doEnableComplete():void
		{
			enable.visible = false;
			disable.visible = true;
		}
		
		protected function doKeyDown( event:KeyboardEvent ):void
		{
			if( event.keyCode == Keyboard.MENU || event.keyCode == Keyboard.M )
			{
				event.preventDefault();
				
				if( y == 337 )
				{
					TweenLite.to( this, 0.60, {
						y: 442
					} );
				} else {
					TweenLite.to( this, 0.60, {
						y: 337
					} );					
				}
			} else if( event.keyCode == Keyboard.BACK || event.keyCode == Keyboard.B ) {
				if( y == 337 )
				{
					event.preventDefault();
					
					TweenLite.to( this, 0.60,  {
						y: 442
					} );
				}
			}
		}
	}
}