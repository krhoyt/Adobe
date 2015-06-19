package com.kevinhoyt;

import com.phonegap.*;

import android.os.Bundle;

public class CruiseClock extends DroidGap 
{
    @Override
    public void onCreate( Bundle savedInstanceState ) 
    {
        super.onCreate( savedInstanceState );
        super.loadUrl( "file:///android_asset/www/index.html" );
    }
}