"use client";

import {
  useConnectWithEmailOtp,
  useDynamicContext,
} from "@dynamic-labs/sdk-react-core";
import { FormEventHandler, useState } from "react";

export default function Home() {
  const { user, handleLogOut } = useDynamicContext();
  const [showOtpForm, setShowOtpForm] = useState(false);

  const { connectWithEmail, verifyOneTimePassword, retryOneTimePassword } =
    useConnectWithEmailOtp();

  const showEmailForm = !user && !showOtpForm;
  const showOtp = !user && showOtpForm;

  if (showEmailForm) {
    const handleSendOtp: FormEventHandler<HTMLFormElement> = async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const formData = new FormData(event.currentTarget);

      const email = formData.get("email") as string;

      await connectWithEmail(email);
      setShowOtpForm(true);
    };

    return (
      <form key="email-form" onSubmit={handleSendOtp}>
        <label>
          Email
          <input type="email" name="email" />
        </label>
        <br />
        <button type="submit">Send OTP</button>
      </form>
    );
  }

  if (showOtp) {
    const handleRetryOtp: FormEventHandler<HTMLFormElement> = async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const formData = new FormData(event.currentTarget);

      const oneTimePassword = formData.get("oneTimePassword") as string;

      await verifyOneTimePassword(oneTimePassword);
      setShowOtpForm(false);
    };

    return (
      <form key="otp-form" onSubmit={handleRetryOtp}>
        <label>
          OTP
          <input type="text" name="oneTimePassword" />
        </label>
        <br />
        <button type="submit">Verify OTP</button>
        <br />
        <button type="button" onClick={retryOneTimePassword}>
          Re-send OTP
        </button>
      </form>
    );
  }

  return (
    <main>
      <h1>Welcome {user?.email}</h1>

      <button onClick={handleLogOut}>Logout</button>
    </main>
  );
}
