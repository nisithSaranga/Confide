import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

GMAIL_ADDRESS = os.getenv("GMAIL_ADDRESS")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

def send_reset_email(to_email: str, token: str):
    reset_link = f"{FRONTEND_URL}/reset-password?token={token}"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Reset your Confide password"
    msg["From"] = GMAIL_ADDRESS
    msg["To"] = to_email

    text_body = f"""You requested a password reset for your Confide account.

Click this link to reset your password (valid for 30 minutes):
{reset_link}

If you didn't request this, you can safely ignore this email."""

    msg.attach(MIMEText(text_body, "plain"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(GMAIL_ADDRESS, GMAIL_APP_PASSWORD)
        server.send_message(msg)