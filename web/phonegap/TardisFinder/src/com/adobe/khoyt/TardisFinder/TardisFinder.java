package com.adobe.khoyt.TardisFinder;

import com.phonegap.*;

import android.os.Bundle;

public class TardisFinder extends DroidGap 
{
    @Override
    public void onCreate( Bundle savedInstanceState ) 
    {
        super.onCreate( savedInstanceState );
        super.loadUrl( "file:///android_asset/www/index.html" );
    }
}