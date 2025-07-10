import emailjs from 'emailjs-com';
import { createClient } from '@supabase/supabase-js';

// ✅ Initialize EmailJS and Supabase using environment variables
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

// ✅ Wait until DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("appointment-form");
  if (form) {
    form.addEventListener("submit", handleAppointmentSubmit);
    console.log("📎 Unified form handler attached.");
  } else {
    console.error("❌ Form not found.");
  }
});

// ✅ Handle form submission
async function handleAppointmentSubmit(event) {
  event.preventDefault();

  const form = document.getElementById("appointment-form");
  const status = document.getElementById("form-status");
  const dateInput = document.getElementById("form-date");
  const submitBtn = document.getElementById("submit-btn");

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const subject = form.subject.value.trim();
  const message = form.message.value.trim();

  // Validate fields
  if (!name || !email || !subject || !message) {
    showStatus("⚠️ Please fill in all required fields.", "orange");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showStatus("⚠️ Please enter a valid email address.", "orange");
    return;
  }

  // Set the timestamp
  const timestamp = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  dateInput.value = timestamp;

  // Disable button
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  // ✅ Step 1: Send via EmailJS
  try {
    await emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      form
    );
    console.log("📧 Email sent successfully.");
  } catch (error) {
    console.error("❌ EmailJS error:", error);
    showStatus("❌ Failed to send email.", "red");
    resetButton();
    return;
  }

  // ✅ Step 2: Save to Supabase
  try {
    const { data, error } = await supabase
      .from("appointments")
      .insert([{ name, email, subject, message, date: timestamp }]);

    if (error) {
      console.error("❌ Supabase Insert Error:", error);
      showStatus("❌ Failed to save to database.", "red");
    } else {
      console.log("✅ Appointment saved:", data);
      showStatus("✅ Appointment request sent and saved!", "green");
      form.reset();
    }
  } catch (err) {
    console.error("🚨 Unexpected Error:", err);
    showStatus("⚠️ Something went wrong.", "red");
  }

  resetButton();

  // ✅ UI helpers
  function showStatus(msg, color) {
    status.textContent = msg;
    status.style.color = color;
  }

  function resetButton() {
    submitBtn.disabled = false;
    submitBtn.textContent = "Send Request";
  }
}
