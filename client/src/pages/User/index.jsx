import { Avatar, Divider, Tag, Typography } from "antd";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { SurfaceCard } from "../../components/layout";
import { theme as cinematicTheme } from "../../styles/theme";

const { Title, Text } = Typography;

function capitalizeRole(role) {
  if (role == null || role === "") return "—";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function initialsFromName(name) {
  if (name == null || String(name).trim() === "") return "?";
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const a = parts[0][0] ?? "";
  const b = parts[parts.length - 1][0] ?? "";
  return `${a}${b}`.toUpperCase();
}

function Profile() {
  const { user } = useSelector((state) => state.user);

  const heroInitials = useMemo(() => initialsFromName(user?.name), [user?.name]);

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">
      <SurfaceCard className="!mb-6 !text-left">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
          <Avatar
            size={104}
            className="flex shrink-0 items-center justify-center text-2xl font-semibold uppercase"
            style={{
              backgroundColor: cinematicTheme.colors.primary,
              color: cinematicTheme.colors.text,
              border: `3px solid ${cinematicTheme.colors.elevated}`,
            }}
          >
            {heroInitials}
          </Avatar>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <Title
              level={3}
              className="!mb-1 !mt-0 !text-[1.65rem]"
              style={{ color: cinematicTheme.colors.text }}
            >
              {user?.name ?? "Your profile"}
            </Title>
            <Text type="secondary" className="block text-base">
              {user?.email}
            </Text>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Tag
                bordered={false}
                style={{
                  margin: 0,
                  padding: "4px 10px",
                  background: cinematicTheme.colors.elevated,
                  color: cinematicTheme.colors.textSecondary,
                }}
              >
                {capitalizeRole(user?.role)}
              </Tag>
            </div>
          </div>
        </div>

        <Divider
          plain
          className="!my-8"
          style={{
            borderColor: cinematicTheme.colors.elevated,
            color: cinematicTheme.colors.muted,
          }}
        />

        <div>
          <Text strong style={{ color: cinematicTheme.colors.textSecondary }}>
            Account
          </Text>
          <div className="mt-3 grid gap-2 text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span style={{ color: cinematicTheme.colors.muted }}>
                Screen name:
              </span>
              <span style={{ color: cinematicTheme.colors.text }}>
                {user?.name ?? "—"}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              <span style={{ color: cinematicTheme.colors.muted }}>
                Signed in as:
              </span>
              <span style={{ color: cinematicTheme.colors.text }}>
                {user?.email ?? "—"}
              </span>
            </div>
          </div>
        </div>
      </SurfaceCard>
    </div>
  );
}

export default Profile;
