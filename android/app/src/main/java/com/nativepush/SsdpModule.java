package com.nativepush;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;


import android.Manifest;
import android.util.Log;
import android.os.SystemClock;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONArray;
import java.io.IOException;
import java.util.HashMap;
import java.util.ArrayList;

public class SsdpModule extends ReactContextBaseJavaModule {

    private UsbMulticast connector = null;
    private static final String TAG = "UsbDiscovery";
    private final static int MULTICAST_SOCKET = 5;
    private final static int MAX_TETHERING_TIMEOUT = 15000;
    private final static String INTERNET_PERMISSION = Manifest.permission.INTERNET;


    public void initialize() {
        connector = new UsbMulticast();
        Log.v(TAG, "Registered!");
    }


    public SsdpModule(ReactApplicationContext reactContext) {
        super(reactContext); //required by React Native
    }

    @Override
    //getName is required to define the name of the module represented in JavaScript
    public String getName() {
        return "SSDP";
    }

    @ReactMethod
    public void sayHi(Callback errorCallback, Callback successCallback) {
        try {
            System.out.println("Greetings from Java");
            successCallback.invoke("Callback : Greetings from Java");
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }

    @ReactMethod
    private void discovery(String st, double version, int mx, Callback callbackContext) {
        System.out.println("In JAVA");
        JSONArray ssdpList = new JSONArray();
        // Current time + mx (max wait time) + 2 seconds * MSEC
        final long loopTime = System.currentTimeMillis() + ((mx + 2) * 1000);
        try {
            connector.tearUp();
            connector.send(st, version, mx);
            while (System.currentTimeMillis() <= loopTime) {
                String response = connector.recv();
                JSONObject ssObj = jsonifyMessage(response);
                if (ssObj.length() > 0) {
                    ssdpList.put(ssObj);
                }
            }

            if (ssdpList.length() > 0 ) {
                System.out.println("ssdpList:"+ssdpList);
                callbackContext.invoke("Callback :"+ssdpList);
            } else {
                System.out.println("no Result:"+PluginUtils.NO_RESULTS);
                callbackContext.invoke("No result :"+PluginUtils.NO_RESULTS);
            }
        } catch(IOException e ) {
            // any error which happens while tearing up, sending or receiving will be
            // handled by this exception.
            //buildStatusMessage(false, e.getMessage(), callbackContext);
        }
        // Errors while closing the socket is already handled by the
        // connector itself
        connector.tearDown();
    }



    private static JSONObject jsonifyMessage(String message) {
        JSONObject ssObj = new JSONObject();
        try {
            SSDPParser ss = new SSDPParser(message);
            ssObj.put("ipAddress", ss.getIpAddress());
            ssObj.put("server", ss.getServer());
            ssObj.put("location", ss.getLocation());
            ssObj.put("usn", ss.getUsn());
            ssObj.put("uuid", ss.getUUID());
        } catch (JSONException e) {
            Log.v(TAG, "Invalid payload for SSDP: " + e.getMessage());
        } catch (SSDPParserException e1) {
            Log.v(TAG, "Invalid payload for SSDP: " + e1.getMessage());
        }

        return ssObj;
    }
}
