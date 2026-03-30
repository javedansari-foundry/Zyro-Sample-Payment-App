package com.zyro.sample.payment

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.appbar.MaterialToolbar
import com.google.android.material.bottomsheet.BottomSheetDialog
import android.widget.Button
import com.google.android.material.snackbar.Snackbar
import com.google.android.material.textfield.TextInputEditText
import kotlin.random.Random

class P2PActivity : AppCompatActivity() {

  private var selected: Contact? = null
  private val handler = Handler(Looper.getMainLooper())

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_p2p)

    findViewById<MaterialToolbar>(R.id.p2p_toolbar).setNavigationOnClickListener { finish() }

    val list = findViewById<RecyclerView>(R.id.p2p_recycler_contacts)
    list.layoutManager = LinearLayoutManager(this)
    list.adapter =
        ContactsAdapter(MockContacts.all) { contact ->
          selected = contact
        }

    val amountField = findViewById<TextInputEditText>(R.id.p2p_amount)
    val noteField = findViewById<TextInputEditText>(R.id.p2p_note)
    val send = findViewById<Button>(R.id.p2p_btn_send)

    send.setOnClickListener { v ->
      val c = selected
      if (c == null) {
        Snackbar.make(v, "Pick a contact", Snackbar.LENGTH_SHORT).show()
        return@setOnClickListener
      }
      val amountStr = amountField.text?.toString().orEmpty().trim()
      val amount = amountStr.toDoubleOrNull()
      if (amount == null || amount <= 0) {
        Snackbar.make(v, "Enter a valid amount", Snackbar.LENGTH_SHORT).show()
        return@setOnClickListener
      }

      val sheet = BottomSheetDialog(this)
      val sheetView = layoutInflater.inflate(R.layout.bottom_sheet_confirm, null)
      sheet.setContentView(sheetView)
      val msg = sheetView.findViewById<TextView>(R.id.sheet_message)
      msg.text =
          "Send $$amountStr to ${c.name}? Note: amount ≥ ${MockConfig.INSUFFICIENT_BALANCE_THRESHOLD} triggers a mock decline."

      sheetView.findViewById<Button>(R.id.sheet_btn_cancel).setOnClickListener {
        sheet.dismiss()
      }
      sheetView.findViewById<Button>(R.id.sheet_btn_confirm).setOnClickListener {
        sheet.dismiss()
        val delay = Random.nextLong(250, 600)
        send.isEnabled = false
        handler.postDelayed(
            {
              send.isEnabled = true
              if (amount >= MockConfig.INSUFFICIENT_BALANCE_THRESHOLD) {
                AlertDialog.Builder(this)
                    .setTitle("Transfer declined")
                    .setMessage("Insufficient balance (mock). Use a smaller amount.")
                    .setPositiveButton("OK", null)
                    .show()
              } else {
                Snackbar.make(v, "Transfer completed (mock)", Snackbar.LENGTH_LONG).show()
              }
            },
            delay)
      }
      sheet.show()
    }
  }
}
