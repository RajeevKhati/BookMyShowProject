import PropTypes from "prop-types";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "../feedback/toast";
import {
  bootstrapSession,
  clearSession,
} from "../redux/userSlice";
import AppShell from "./layout/AppShell";
import {
  getDashboardPath,
  getStaffWorkspacePath,
} from "../utils/dashboardPath";

/** Re-export for callers that derive navigation from role */
export { getDashboardPath, getStaffWorkspacePath } from "../utils/dashboardPath";

/** Open route if `allowedRoles` empty; otherwise require one of those roles */
function allowsRole(user, allowedRoles) {
  if (!user) return false;
  if (!allowedRoles?.length) return true;
  return allowedRoles.includes(user.role);
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user, sessionStatus } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const canRender = allowsRole(user, allowedRoles);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (sessionStatus === "ready" || sessionStatus === "loading" || sessionStatus === "failed") {
      return;
    }

    dispatch(bootstrapSession()).then((result) => {
      if (!bootstrapSession.rejected.match(result) || result.meta?.condition) {
        return;
      }

      const err = result.payload;
      if (err?.code === "NO_TOKEN") {
        navigate("/login");
        return;
      }

      localStorage.removeItem("token");
      dispatch(clearSession());
      navigate("/login");
      toast.error(err?.message || "Please sign in again.");
    });
  }, [dispatch, navigate, sessionStatus]);

  useEffect(() => {
    if (!user || !allowedRoles?.length) return;
    if (allowedRoles.includes(user.role)) return;
    toast.warning("You don't have permission to access this area.");
    navigate(getDashboardPath(user.role), { replace: true });
  }, [user, allowedRoles, navigate]);

  const onPrimaryNav = useCallback(
    (key) => {
      if (!user) return;
      if (key === "home") {
        navigate("/");
        return;
      }
      if (key === "account") {
        navigate("/profile");
        return;
      }
      if (key === "workspace") {
        const path = getStaffWorkspacePath(user.role);
        if (path) navigate(path);
        return;
      }
      if (key === "bookings") {
        navigate("/bookings");
        return;
      }
      if (key === "logout") {
        localStorage.removeItem("token");
        dispatch(clearSession());
        navigate("/login");
      }
    },
    [dispatch, navigate, user],
  );

  const sessionReady = sessionStatus === "ready" && Boolean(user);
  const renderChildren = sessionReady && canRender;

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
