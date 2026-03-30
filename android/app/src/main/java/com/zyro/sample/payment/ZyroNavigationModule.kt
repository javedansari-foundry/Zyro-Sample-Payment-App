package com.zyro.sample.payment

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ZyroNavigationModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "ZyroNavigation"

  @ReactMethod
  fun openP2P() {
    reactContext.currentActivity?.let { activity ->
      activity.startActivity(Intent(activity, P2PActivity::class.java))
    }
  }

  @ReactMethod
  fun openProfile() {
    reactContext.currentActivity?.let { activity ->
      activity.startActivity(Intent(activity, ProfileActivity::class.java))
    }
  }

  @ReactMethod
  fun logout() {
    reactContext.currentActivity?.let { activity ->
      val intent = Intent(activity, LoginActivity::class.java)
      intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
      activity.startActivity(intent)
    }
  }
}
