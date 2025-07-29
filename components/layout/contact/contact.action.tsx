// app/contact/actions.ts
"use server"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
})

export async function submitContactForm(formData: {
  name: string
  email: string
  phone: string
  message: string
}) {
  const parsed = schema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: "Invalid data." }
  }

  const isEmailValid = async (email: string) => {
    try {
     const key = process.env.NEXT_PUBLIC_MAILBOXLAYER_KEY;
      const res = await fetch(
        `https://apilayer.net/api/check?access_key=${key}&email=${email}&smtp=1&format=1`
      )
      const data = await res.json()
      return data.smtp_check && data.mx_found && data.format_valid
    } catch (err) {
      console.error("Error verifying email:", err)
      return false
    }
  }

  const validEmail = await isEmailValid(formData.email)
  if (!validEmail) {
    return { success: false, error: "Invalid email address." }
  }

  const supabase = createClient()

  const { error } = await supabase.from("Contact").insert([formData])

  if (error) {
    console.error(error)
    return { success: false, error: "Failed to send message." }
  }

  return { success: true }
}
