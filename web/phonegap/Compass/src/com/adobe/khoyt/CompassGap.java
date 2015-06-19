package com.adobe.khoyt;

import com.phonegap.*;

import android.os.Bundle;

public class CompassGap extends DroidGap 
{
    @Override
    public void onCreate( Bundle savedInstanceState ) 
    {
        super.onCreate( savedInstanceState );
        super.loadUrl( "file:///android_asset/www/index.html" );
    }
}