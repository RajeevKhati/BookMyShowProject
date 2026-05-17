import React, { useEffect, useMemo } from "react";
import { Form } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ResetPassword } from "../../api/user";
import { toast } from "../../feedback/toast";
import {
  CenteredShell,
  InsetFooter,
  PageHeading,
  SurfaceCard,
} from "../../components/layout";
import { TextField, UiButton } from "../../components/ui";
import { theme as cinematicTheme } from "../../styles/theme";

function safeDecodeURIComponent(value) {
  if (value == null || value === "") return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function Reset() {
  const { email } = useParams();
  const navigate = useNavigate();

  const displayEmail = useMemo(() => safeDecodeURIComponent(email), [email]);

  const onFinish = async (values) => {
    try {
      const response = await ResetPassword(values, email);
      if (response.status === "success") {
        toast.success(response.message);
        navigate("/login");
      } else {
        toast.error(response.message);
      }
    } catch {
      // HTTP/network failures: toast via axios error interceptor.
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <CenteredShell containerClassName="max-w-[440px]">
      <PageHeading
        eyebrow="CineVault"
        title="Reset password"
        subtitle={
          displayEmail
            ? `Enter the code we sent and choose a new password for ${displayEmail}.`
            : "Enter the code we sent and choose a new password."
        }
      />

      <SurfaceCard>
        <Form layout="vertical" onFinish={onFinish} className="text-left">
          <Form.Item
            label="Verification code"
            htmlFor="otp"
            name="otp"
            rules={[{ required: true, message: "Code is required" }]}
          >
            <TextField
              id="otp"
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit code"
            />
          </Form.Item>
          <Form.Item
            label="New password"
            htmlFor="password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <TextField
              id="password"
              password
              autoComplete="new-password"
              placeholder="Choose a strong password"
            />
          </Form.Item>
          <Form.Item className="mb-0">
            <UiButton variant="primary" block htmlType="submit">
              Update password
            </UiButton>
          </Form.Item>
        </Form>
      </SurfaceCard>

      <InsetFooter className="space-y-2">
        <p className="m-0">
          <Link
            to="/login"
            className="font-semibold no-underline transition-colors hover:text-[#FF3D47]"
            style={{ color: cinematicTheme.colors.primary }}
          >
            Back to sign in
          </Link>
        </p>
        <p className="m-0">
          <Link
            to="/forget"
            className="font-semibold text-[#B3B3B3] no-underline transition-colors hover:text-white"
          >
            Didn&apos;t receive a code?
          </Link>
        </p>
      </InsetFooter>
    </CenteredShell>
  );
}

export default Reset;
