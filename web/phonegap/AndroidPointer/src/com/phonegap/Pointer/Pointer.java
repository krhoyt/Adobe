package com.phonegap.Pointer;

import android.os.Bundle;
import com.phonegap.*;

public class Pointer extends DroidGap
{
    @Override
    public void onCreate( Bundle savedInstanceState )
    {
        super.onCreate( savedInstanceState );
        super.loadUrl( "file:///android_asset/www/index.html" );
    }
}