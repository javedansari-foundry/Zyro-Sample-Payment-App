package com.zyro.sample.payment

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity
import android.widget.Button
import com.google.android.material.checkbox.MaterialCheckBox
import com.google.android.material.snackbar.Snackbar
import com.google.android.material.textfield.TextInputEditText

class RegisterActivity : AppCompatActivity() {

  private val handler = Handler(Looper.getMainLooper())

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_register)

    val name = findViewById<TextInputEditText>(R.id.register_name)
    val email = findViewById<TextInputEditText>(R.id.register_email)
    val password = findViewById<TextInputEditText>(R.id.register_password)
    val terms = findViewById<MaterialCheckBox>(R.id.cb_terms_accept)
    val submit = findViewById<Button>(R.id.btn_register_submit)
    val back = findViewById<Button>(R.id.btn_register_back)

    submit.setOnClickListener { v ->
      val n = name.text?.toString().orEmpty().trim()
      val e = email.text?.toString().orEmpty().trim()
      val p = password.text?.toString().orEmpty()
      if (n.isEmpty() || e.isEmpty() || p.length < 4) {
        Snackbar.make(v, "Fill name, email, password (4+ chars)", Snackbar.LENGTH_LONG).show()
        return@setOnClickListener
      }
      if (!terms.isChecked) {
        Snackbar.make(v, "Accept terms to continue", Snackbar.LENGTH_LONG).show()
        return@setOnClickListener
      }
      submit.isEnabled = false
      handler.postDelayed(
          {
            submit.isEnabled = true
            Snackbar.make(v, "Account created (mock)", Snackbar.LENGTH_LONG).show()
            handler.postDelayed({ finish() }, 1200)
          },
          450)
    }

    back.setOnClickListener { finish() }
  }
}
