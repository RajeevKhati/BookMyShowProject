import React from "react";
import { Form, Radio } from "antd";
import { Link } from "react-router-dom";
import { RegisterUser } from "../api/user";
import { toast } from "../feedback/toast";
import {
  CenteredShell,
  InsetFooter,
  PageHeading,
  SurfaceCard,
} from "../components/layout";
import {
  RadioRowGroup,
  TextField,
  UiButton,
} from "../components/ui";
import { theme as cinematicTheme } from "../styles/theme";

function Register() {
  const onFinish = async (values) => {
    try {
      const response = await RegisterUser(values);
      if (response.success) {
        toast.success(response.message);
      }
    } catch {
      // Register failures: toast via axios interceptors.
    }
  };

  return (
    <CenteredShell containerClassName="max-w-[440px]">
      <PageHeading
        eyebrow="CineVault"
        title="Create an account"
        subtitle="Join to browse showtimes and book seats."
      />

      <SurfaceCard>
        <Form
          layout="vertical"
          onFinish={onFinish}
          className="text-left"
          initialValues={{ role: "user" }}
        >
          <Form.Item
            label="Name"
            htmlFor="name"
            name="name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <TextField
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Your name"
            />
          </Form.Item>
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
              autoComplete="new-password"
              placeholder="Create a password"
            />
          </Form.Item>
          <Form.Item
            label="Register as a partner"
            htmlFor="role"
            name="role"
            rules={[{ required: true, message: "Please select an option" }]}
          >
            <RadioRowGroup id="role">
              <Radio value="user">No — standard account</Radio>
              <Radio value="partner">Yes — theatre partner</Radio>
            </RadioRowGroup>
          </Form.Item>
          <Form.Item className="mb-0">
            <UiButton variant="primary" block htmlType="submit">
              Create account
            </UiButton>
          </Form.Item>
        </Form>
      </SurfaceCard>

      <InsetFooter>
        <p className="m-0">
          Already have an account?{" "}
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

export default Register;
