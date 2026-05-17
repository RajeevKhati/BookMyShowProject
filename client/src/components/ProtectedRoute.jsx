import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { GetCurrentUser } from "../api/user";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { setUser } from "../redux/userSlice";
import AppShell from "./layout/AppShell";
import { getDashboardPath } from "../utils/dashboardPath";

/** Re-export for callers that derive navigation from role */
export { getDashboardPath } from "../utils/dashboardPath";

/** Open route if `allowedRoles` empty; otherwise require one of those roles */
function allowsRole(user, allowedRoles) {
  if (!user) return false;
  if (!allowedRoles?.length) return true;
  return allowedRoles.includes(user.role);
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sessionChecked, setSessionChecked] = useState(false);

  const canRender = allowsRole(user, allowedRoles);

  const bootstrapSession = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      setSessionChecked(true);
      return;
    }
    try {
      dispatch(showLoading());
      const payload = await GetCurrentUser();

      const nextUser =
        payload?.success && payload?.data != null ? payload.data : null;

      if (nextUser) {
        dispatch(setUser(nextUser));
      } else {
        throw new Error(
          payload?.message || "Unable to restore your session. Please sign in again.",
        );
      }
    } catch (error) {
      dispatch(setUser(null));
      navigate("/login");
      message.error(
        error instanceof Error ? error.message : "Please sign in again.",
      );
    } finally {
      dispatch(hideLoading());
      setSessionChecked(true);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    bootstrapSession();
  }, [bootstrapSession]);

  useEffect(() => {
    if (!user || !allowedRoles?.length) return;
    if (allowedRoles.includes(user.role)) return;
    message.warning("You don't have permission to access this area.");
    navigate(getDashboardPath(user.role), { replace: true });
  }, [user, allowedRoles, navigate]);

  const onPrimaryNav = useCallback(
    (key) => {
      if (!user) return;
      if (key === "home") {
        navigate("/");
        return;
      }
      if (key === "profile") {
        navigate(getDashboardPath(user.role));
        return;
      }
      if (key === "logout") {
        localStorage.removeItem("token");
        navigate("/login");
      }
    },
    [navigate, user],
  );

  const renderChildren = sessionChecked && Boolean(user) && canRender;

  if (!renderChildren) {
    return null;
  }

  return (
    <AppShell user={user} onPrimaryNav={onPrimaryNav}>
      {children}
    </AppShell>
  );
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

ProtectedRoute.defaultProps = {
  allowedRoles: undefined,
};

export default ProtectedRoute;
