import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  BookOutlined,
  DownOutlined,
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Layout } from "antd";
import { useMemo } from "react";
import { theme as cinematicTheme } from "../../styles/theme";

function UserNavDropdown({ userName, userRole, onSelect }) {
  const items = useMemo(() => {
    const base = [
      {
        key: "profile",
        icon: <ProfileOutlined className="text-[#B3B3B3]" />,
        label: "My profile",
      },
    ];
    if (userRole === "user") {
      base.push({
        key: "bookings",
        icon: <BookOutlined className="text-[#B3B3B3]" />,
        label: "My bookings",
      });
    }
    base.push(
      { type: "divider" },
      {
        key: "logout",
        danger: true,
        icon: <LogoutOutlined />,
        label: "Log out",
      },
    );
    return base;
  }, [userRole]);

  const displayName = userName?.trim() || "Account";

  return (
    <Dropdown
      menu={{
        items,
        onClick: ({ key }) => onSelect(key),
      }}
      placement="bottomRight"
      trigger={["hover", "click"]}
      overlayStyle={{ minWidth: 200 }}
      dropdownRender={(menu) => (
        <div
          className="overflow-hidden rounded-xl border shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
          style={{
            backgroundColor: cinematicTheme.colors.card,
            borderColor: cinematicTheme.colors.elevated,
          }}
        >
          {menu}
        </div>
      )}
    >
      <button
        type="button"
        className="ml-1 inline-flex max-w-[min(100%,280px)] cursor-pointer items-center gap-2 rounded-xl border px-2 py-1.5 text-left transition-colors hover:bg-[#262626] sm:ml-2 sm:px-3 sm:py-2"
        style={{
          borderColor: "transparent",
          color: cinematicTheme.colors.textSecondary,
        }}
        aria-haspopup="menu"
        aria-label={`Account menu for ${displayName}`}
      >
        <Avatar
          size={36}
          icon={<UserOutlined />}
          className="shrink-0"
          style={{
            backgroundColor: cinematicTheme.colors.elevated,
            color: cinematicTheme.colors.text,
          }}
        />
        <span className="hidden min-w-0 flex-1 truncate text-sm font-semibold text-[#E8E8E8] sm:inline">
          {displayName}
        </span>
        <DownOutlined className="shrink-0 text-[10px] opacity-60" />
      </button>
    </Dropdown>
  );
}

UserNavDropdown.propTypes = {
  userName: PropTypes.string,
  userRole: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

UserNavDropdown.defaultProps = {
  userName: undefined,
  userRole: undefined,
};

/**
 * Persistent chrome for authenticated routes: top bar + scrollable content.
 */
function AppShell({ user, onPrimaryNav, children }) {
  const { Header } = Layout;

  const navClusterClass =
    "flex shrink-0 items-center gap-1 sm:gap-2 md:ml-auto";

  const homeNavClass =
    "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold no-underline transition-colors hover:bg-[#262626] hover:text-white";

  return (
    <Layout className="min-h-screen bg-[#0F0F0F]">
      <Header
        className="flex !h-16 !leading-none items-center gap-4 !px-4 sm:!px-6"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 200,
          backgroundColor: cinematicTheme.colors.card,
          borderBottom: `1px solid ${cinematicTheme.colors.elevated}`,
        }}
      >
        <Link
          to="/"
          className="shrink-0 text-lg font-bold tracking-tight no-underline transition-opacity hover:opacity-90"
        >
          <span style={{ color: cinematicTheme.colors.primary }}>Cine</span>
          <span style={{ color: cinematicTheme.colors.text }}>Vault</span>
        </Link>

        <div className={`${navClusterClass} flex-1 justify-end`}>
          <Link
            to="/"
            className={homeNavClass}
            style={{ color: cinematicTheme.colors.textSecondary }}
          >
            <HomeOutlined />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <UserNavDropdown
            userName={user?.name}
            userRole={user?.role}
            onSelect={(key) => onPrimaryNav(key)}
          />
        </div>
      </Header>
      <Layout.Content
        style={{
          padding: cinematicTheme.spacing.lg,
          minHeight: "calc(100vh - 64px)",
          background: cinematicTheme.colors.background,
          color: cinematicTheme.colors.text,
        }}
      >
        {children}
      </Layout.Content>
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
