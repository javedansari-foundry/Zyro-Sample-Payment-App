package com.zyro.sample.payment

data class Contact(val id: String, val name: String, val handle: String)

object MockContacts {
  val all: List<Contact> =
      (1..20).map { i ->
        Contact("c$i", "Contact $i", "@user$i")
      }
}
