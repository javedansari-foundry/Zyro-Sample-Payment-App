package com.zyro.sample.payment

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.appbar.MaterialToolbar

class ProfileActivity : AppCompatActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_profile)

    findViewById<MaterialToolbar>(R.id.profile_toolbar).setNavigationOnClickListener { finish() }
  }
}
