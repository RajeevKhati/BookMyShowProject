import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { GetCurrentUser } from "../api/user";
import { setUser } from "../redux/userSlice";
import { message, Layout, Menu } from "antd";

/** Where "My Profile" and unauthorized redirects go — must match `/admin`, `/partner`, `/profile` rules */
export function getDashboardPath(role) {
  if (role === "admin") return "/admin";
  if (role === "partner") return "/partner";
  return "/profile";
}

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Header } = Layout;

  const roleAllowed =
    user &&
    (!allowedRoles?.length || allowedRoles.includes(user.role));

  const navItems = useMemo(
    () => [
      {
        key: "home",
        label: "Home",
        icon: <HomeOutlined />,
      },
      {
        key: "user",
        label: `${user?.name ?? ""}`,
        icon: <UserOutlined />,
        children: [
          {
            key: "profile",
            label: "My Profile",
            icon: <ProfileOutlined />,
          },
          {
            key: "logout",
            label: (
              <Link
                to="/login"
                onClick={() => {
                  localStorage.removeItem("token");
                }}
              >
                Log Out
              </Link>
            ),
            icon: <LogoutOutlined />,
          },
        ],
      },
    ],
    [user?.name],
  );

  const onMenuClick = ({ key }) => {
    if (key === "profile" && user) {
      navigate(getDashboardPath(user.role));
    }
  };

  const getValidUser = async () => {
    try {
      dispatch(showLoading());
      const response = await GetCurrentUser();
      dispatch(setUser(response.data));
    } catch (error) {
      dispatch(setUser(null));
      navigate("/login");
      message.error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getValidUser();
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (!user || !allowedRoles?.length) return;
    if (allowedRoles.includes(user.role)) return;
    message.warning("You don't have permission to access this area.");
    navigate(getDashboardPath(user.role), { replace: true });
  }, [user, allowedRoles, navigate]);

  return (
    user &&
    roleAllowed && (
      <>
        <Layout>
          <Header
            className="d-flex justify-content-between"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <h3 className="demo-logo text-white m-0" style={{ color: "white" }}>
              Book My Show
            </h3>
            <Menu
              theme="dark"
              mode="horizontal"
              items={navItems}
              onClick={onMenuClick}
            />
          </Header>
          <div style={{ padding: 24, minHeight: 380, background: "#fff" }}>
            {children}
          </div>
        </Layout>
      </>
    )
  );
};

export default ProtectedRoute;
