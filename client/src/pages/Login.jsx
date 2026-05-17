import React from "react";
import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../api/user";
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 antialiased bg-[#0F0F0F] text-white font-[system-ui,Inter,sans-serif]">
      <div className="w-full max-w-[440px]">
        <header className="mb-8 text-center">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.22em]"
            style={{ color: cinematicTheme.colors.primary }}
          >
            CineVault
          </p>
          <h1 className="m-0 text-3xl font-bold tracking-tight">
            Sign in
          </h1>
          <p
            className="mt-2 mb-0 text-base leading-relaxed"
            style={{ color: cinematicTheme.colors.textSecondary }}
          >
            Enter your credentials to continue booking movies.
          </p>
        </header>

        <section
          className="rounded-2xl border p-6 shadow-[0_8px_40px_rgba(0,0,0,0.55)] sm:p-8"
          style={{
            backgroundColor: cinematicTheme.colors.card,
            borderColor: cinematicTheme.colors.elevated,
          }}
        >
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
              <Input
                id="email"
                size="large"
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
              <Input.Password
                id="password"
                size="large"
                autoComplete="current-password"
                placeholder="Enter your password"
              />
            </Form.Item>
            <Form.Item className="mb-0">
              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                className="!font-semibold !text-base shadow-none"
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </section>

        <footer
          className="mt-8 space-y-2 text-center text-sm"
          style={{ color: cinematicTheme.colors.textSecondary }}
        >
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
        </footer>
      </div>
    </div>
  );
}

export default Login;
