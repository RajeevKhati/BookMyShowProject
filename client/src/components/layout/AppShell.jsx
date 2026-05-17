import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import {
  BookOutlined,
  DashboardOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuOutlined,
  ProfileOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Dropdown, Layout } from "antd";
import { useMemo } from "react";
import { theme as cinematicTheme } from "../../styles/theme";
import { getStaffWorkspacePath } from "../../utils/dashboardPath";

function shellNavInactiveColor() {
  return cinematicTheme.colors.textSecondary;
}

function DesktopShellNav({ userRole, workspacePath, onLogout }) {
  const navClass = ({ isActive }) =>
    [
      "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold no-underline transition-colors hover:bg-[#262626] hover:text-white",
      isActive ? "bg-[#262626]" : "",
    ].join(" ");

  const navStyle = ({ isActive }) => ({
    color: isActive ? cinematicTheme.colors.text : shellNavInactiveColor(),
  });

  return (
    <nav
      className="hidden items-center gap-1 md:flex"
      aria-label="Primary navigation"
    >
      <NavLink
        end
        to="/"
        className={navClass}
        style={navStyle}
      >
        <HomeOutlined />
        Home
      </NavLink>

      {userRole === "user" && (
        <NavLink
          to="/bookings"
          className={navClass}
          style={navStyle}
        >
          <BookOutlined />
          Bookings
        </NavLink>
      )}

      {workspacePath ? (
        <NavLink
          to={workspacePath}
          className={navClass}
          style={navStyle}
        >
          {userRole === "admin" ? (
            <>
              <DashboardOutlined />
              Admin panel
            </>
          ) : (
            <>
              <ShopOutlined />
              Partner hub
            </>
          )}
        </NavLink>
      ) : null}

      <NavLink
        to="/profile"
        className={navClass}
        style={navStyle}
      >
        <ProfileOutlined />
        Account
      </NavLink>

      <button
        type="button"
        onClick={onLogout}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-none bg-transparent px-3 py-2 text-sm font-semibold transition-colors hover:bg-[#262626]"
        style={{ color: cinematicTheme.colors.error }}
      >
        <LogoutOutlined />
        Log out
      </button>
    </nav>
  );
}

DesktopShellNav.propTypes = {
  userRole: PropTypes.string,
  workspacePath: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
};

DesktopShellNav.defaultProps = {
  userRole: undefined,
  workspacePath: undefined,
};

function MobileShellNav({ userRole, onSelect }) {
  const items = useMemo(() => {
    const grayIcon = "text-[#B3B3B3]";
    const list = [
      {
        key: "home",
        icon: <HomeOutlined className={grayIcon} />,
        label: "Home",
      },
    ];
    if (userRole === "user") {
      list.push({
        key: "bookings",
        icon: <BookOutlined className={grayIcon} />,
        label: "My bookings",
      });
    }
    if (userRole === "admin") {
      list.push({
        key: "workspace",
        icon: <DashboardOutlined className={grayIcon} />,
        label: "Admin panel",
      });
    }
    if (userRole === "partner") {
      list.push({
        key: "workspace",
        icon: <ShopOutlined className={grayIcon} />,
        label: "Partner hub",
      });
    }
    list.push({
      key: "account",
      icon: <ProfileOutlined className={grayIcon} />,
      label: "Account",
    });
    list.push({ type: "divider" });
    list.push({
      key: "logout",
      danger: true,
      icon: <LogoutOutlined />,
      label: "Log out",
    });
    return list;
  }, [userRole]);

  return (
    <div className="md:hidden">
      <Dropdown
        menu={{
          items,
          onClick: ({ key }) => onSelect(key),
        }}
        placement="bottomRight"
        trigger={["click"]}
        overlayStyle={{ minWidth: 220 }}
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
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[#E8E8E8] transition-colors hover:bg-[#262626]"
          style={{ borderColor: "transparent" }}
          aria-haspopup="menu"
          aria-label="Open navigation menu"
        >
          <MenuOutlined className="text-lg" />
        </button>
      </Dropdown>
    </div>
  );
}

MobileShellNav.propTypes = {
  userRole: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

MobileShellNav.defaultProps = {
  userRole: undefined,
};

/**
 * Persistent chrome for authenticated routes: top bar + scrollable content.
 */
function AppShell({ user, onPrimaryNav, children }) {
  const { Header } = Layout;

  const workspacePath = getStaffWorkspacePath(user?.role);

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

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3 md:ml-auto">
          <DesktopShellNav
            userRole={user?.role}
            workspacePath={workspacePath ?? undefined}
            onLogout={() => onPrimaryNav("logout")}
          />
          <MobileShellNav
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
