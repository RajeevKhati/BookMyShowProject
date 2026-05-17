import React from "react";
import { Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../api/user";
import {
  CenteredShell,
  InsetFooter,
  PageHeading,
  SurfaceCard,
} from "../components/layout";
import { TextField, UiButton } from "../components/ui";
import { theme as cinematicTheme } from "../styles/theme";

function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log(values);
    try {
      const response = await LoginUser(values);
      if (response.success) {
        localStorage.setItem("token", response.data);
        message.success(response.message);
        navigate("/");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <CenteredShell containerClassName="max-w-[440px]">
      <PageHeading
        eyebrow="CineVault"
        title="Sign in"
        subtitle="Enter your credentials to continue booking movies."
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
          <Form.Item
            label="Password"
            htmlFor="password"
            name="password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <TextField
              id="password"
              password
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </Form.Item>
          <Form.Item className="mb-0">
            <UiButton variant="primary" block htmlType="submit">
              Sign in
            </UiButton>
          </Form.Item>
        </Form>
      </SurfaceCard>

      <InsetFooter className="space-y-2">
        <p className="m-0">
          New user?{" "}
          <Link
            to="/register"
            className="font-semibold no-underline transition-colors hover:text-[#FF3D47]"
            style={{ color: cinematicTheme.colors.primary }}
          >
            Register
          </Link>
        </p>
        <p className="m-0">
          <Link
            to="/forget"
            className="font-semibold text-[#B3B3B3] no-underline transition-colors hover:text-white"
          >
            Forgot password?
          </Link>
        </p>
      </InsetFooter>
    </CenteredShell>
  );
}

export default Login;
