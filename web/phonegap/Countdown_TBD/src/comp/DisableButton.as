package comp
{
	import flash.display.DisplayObject;
	import flash.display.SimpleButton;
	
	import images.DisableDown;
	import images.DisableUp;
	
	public class DisableButton extends SimpleButton
	{
		public function DisableButton()
		{
			upState = new DisableUp();
			overState = new DisableUp();
			downState = new DisableDown();
			hitTestState = new DisableUp();
			
			useHandCursor = false;
		}
	}
}