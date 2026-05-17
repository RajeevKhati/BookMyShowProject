import React from "react";
import { Form } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ForgetPassword } from "../../api/user";
import { toast } from "../../feedback/toast";
import {
  CenteredShell,
  InsetFooter,
  PageHeading,
  SurfaceCard,
} from "../../components/layout";
import { TextField, UiButton } from "../../components/ui";
import { theme as cinematicTheme } from "../../styles/theme";

function Forget() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await ForgetPassword(values);
      if (response.status === "success") {
        toast.success(response.message);
        navigate(`/reset/${encodeURIComponent(values.email)}`);
      } else {
        toast.error(response.message);
      }
    } catch {
      // HTTP/network failures: toast via axios error interceptor.
    }
  };

  return (
    <CenteredShell containerClassName="max-w-[440px]">
      <PageHeading
        eyebrow="CineVault"
        title="Forgot password"
        subtitle="Enter your email and we’ll send a one-time code to reset your password."
      />

      <SurfaceCard>
        <Form layout="vertical" onFinish={onFinish} className="text-left">
          <Form.Item
            label="Email"
            htmlFor="email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <TextField
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
          </Form.Item>
          <Form.Item className="mb-0">
            <UiButton variant="primary" block htmlType="submit">
              Send code
            </UiButton>
          </Form.Item>
        </Form>
      </SurfaceCard>

      <InsetFooter>
        <p className="m-0">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold no-underline transition-colors hover:text-[#FF3D47]"
            style={{ color: cinematicTheme.colors.primary }}
          >
            Sign in
          </Link>
        </p>
      </InsetFooter>
    </CenteredShell>
  );
}

export default Forget;
