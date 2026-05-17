import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useMemo } from "react";
import { theme as cinematicTheme } from "../../styles/theme";
import { getDashboardPath } from "../../utils/dashboardPath";

function buildNavItems(userName) {
  return [
    {
      key: "home",
      label: "Home",
      icon: <HomeOutlined />,
    },
    {
      key: "account_group",
      label: userName || "Account",
      icon: <UserOutlined />,
      children: [
        {
          key: "profile",
          label: "My profile",
          icon: <ProfileOutlined />,
        },
        {
          key: "logout",
          danger: true,
          label: "Log out",
          icon: <LogoutOutlined />,
        },
      ],
    },
  ];
}

/**
 * Persistent chrome for authenticated routes: top bar + scrollable content.
 */
function AppShell({ user, onPrimaryNav, children }) {
  const { Header } = Layout;

  const navItems = useMemo(
    () => buildNavItems(user?.name),
    [user?.name],
  );

  const headerStyle = {
    position: "sticky",
    top: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingInline: 20,
    lineHeight: "64px",
    height: 64,
    background: cinematicTheme.colors.card,
    borderBottom: `1px solid ${cinematicTheme.colors.elevated}`,
  };

  const contentStyle = {
    padding: cinematicTheme.spacing.lg,
    minHeight: "calc(100vh - 64px)",
    background: cinematicTheme.colors.background,
    color: cinematicTheme.colors.text,
  };

  return (
    <Layout className="min-h-screen bg-[#0F0F0F]">
      <Header style={headerStyle}>
        <Link
          to="/"
          className="text-lg font-bold tracking-tight no-underline transition-opacity hover:opacity-90"
        >
          <span style={{ color: cinematicTheme.colors.primary }}>Cine</span>
          <span style={{ color: cinematicTheme.colors.text }}>Vault</span>
        </Link>
        <Menu
          mode="horizontal"
          theme="dark"
          triggerSubMenuAction="hover"
          items={navItems}
          onClick={({ key }) => onPrimaryNav(key)}
          selectable={false}
          style={{
            flex: "1 1 auto",
            justifyContent: "flex-end",
            minWidth: 0,
            border: "none",
            background: "transparent",
            color: cinematicTheme.colors.textSecondary,
          }}
        />
      </Header>
      <Layout.Content style={contentStyle}>{children}</Layout.Content>
    </Layout>
  );
}

AppShell.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
  onPrimaryNav: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default AppShell;
