package comp
{
	import flash.display.DisplayObject;
	import flash.display.SimpleButton;
	
	import images.EnableDown;
	import images.EnableUp;
	
	public class EnableButton extends SimpleButton
	{
		public function EnableButton()
		{
			upState = new EnableUp();
			overState = new EnableUp();
			downState = new EnableDown();
			hitTestState = new EnableUp();
			
			useHandCursor = false;
		}
	}
}