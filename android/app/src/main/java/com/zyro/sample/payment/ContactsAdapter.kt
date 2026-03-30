package com.zyro.sample.payment

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class ContactsAdapter(
    private val items: List<Contact>,
    private val onSelect: (Contact) -> Unit,
) : RecyclerView.Adapter<ContactsAdapter.VH>() {

  private var selectedId: String? = null

  class VH(itemView: View) : RecyclerView.ViewHolder(itemView) {
    val name: TextView = itemView.findViewById(R.id.contact_name)
    val detail: TextView = itemView.findViewById(R.id.contact_detail)
  }

  override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VH {
    val v = LayoutInflater.from(parent.context).inflate(R.layout.item_contact, parent, false)
    return VH(v)
  }

  override fun getItemCount(): Int = items.size

  override fun onBindViewHolder(holder: VH, position: Int) {
    val c = items[position]
    holder.name.text = c.name
    holder.detail.text = c.handle
    holder.itemView.contentDescription = "Contact row ${c.name}"
    holder.itemView.isSelected = c.id == selectedId
    holder.itemView.setOnClickListener {
      selectedId = c.id
      notifyDataSetChanged()
      onSelect(c)
    }
  }
}
