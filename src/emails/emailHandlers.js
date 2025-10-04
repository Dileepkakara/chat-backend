// backend/src/emails/emailHandlers.js
import { resendClient, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export async function sendWelcomeEmail(email, name, clientUrl) {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name}<${sender.email}>`,
        to: email,
        subject: "Welcome to Chat App",
        html: createWelcomeEmailTemplate(name, clientUrl),
    });

    if (error) {
        console.error("Error sending welcome email:", error);
        throw new Error("Failed to send welcome email");
    }

    console.log("Welcome email sent successfully:", data);
}
