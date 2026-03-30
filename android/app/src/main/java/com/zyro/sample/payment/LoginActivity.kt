package com.zyro.sample.payment

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import android.widget.Button
import com.google.android.material.snackbar.Snackbar
import com.google.android.material.textfield.TextInputEditText
import kotlin.random.Random

class LoginActivity : AppCompatActivity() {

  private val handler = Handler(Looper.getMainLooper())
  private var otpSent = false

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_login)

    val phone = findViewById<TextInputEditText>(R.id.et_phone)
    val otp = findViewById<TextInputEditText>(R.id.et_otp_code)
    val btnSend = findViewById<Button>(R.id.btn1)
    val btnVerify = findViewById<Button>(R.id.button_verify)
    val linkRegister = findViewById<View>(R.id.link_register)

    btnSend.setOnClickListener {
      val p = phone.text?.toString().orEmpty().trim()
      if (p.length < 8) {
        Snackbar.make(it, "Enter a valid phone (mock: 8+ digits)", Snackbar.LENGTH_LONG).show()
        return@setOnClickListener
      }
      btnSend.isEnabled = false
      val delayMs = Random.nextLong(300, 801)
      handler.postDelayed(
          {
            otpSent = true
            btnSend.isEnabled = true
            Snackbar.make(it, "OTP sent (mock)", Snackbar.LENGTH_SHORT).show()
          },
          delayMs)
    }

    btnVerify.setOnClickListener { v ->
      if (!otpSent) {
        Snackbar.make(v, "Send OTP first", Snackbar.LENGTH_SHORT).show()
        return@setOnClickListener
      }
      val code = otp.text?.toString().orEmpty().trim()
      if (code == MockConfig.OTP) {
        Snackbar.make(v, "Signed in (mock)", Snackbar.LENGTH_SHORT).show()
        handler.postDelayed(
            {
              startActivity(Intent(this@LoginActivity, MainActivity::class.java))
              finish()
            },
            500)
      } else {
        AlertDialog.Builder(this)
            .setTitle("Verification failed")
            .setMessage("Invalid OTP. Mock OTP is ${MockConfig.OTP}.")
            .setPositiveButton("OK", null)
            .show()
      }
    }

    linkRegister.setOnClickListener {
      startActivity(Intent(this, RegisterActivity::class.java))
    }
  }
}
