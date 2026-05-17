import { Spin } from "antd";
import { useSelector } from "react-redux";
import { selectIsGlobalLoading } from "../redux/loaderSlice";
import { theme as cinematicTheme } from "../styles/theme";

/** Full-screen overlay while axios requests are in flight (ref-counted). */
function GlobalLoader() {
  const loading = useSelector(selectIsGlobalLoading);

  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{
        backgroundColor: "rgba(15, 15, 15, 0.55)",
      }}
      aria-busy="true"
      aria-live="polite"
    >
      <Spin size="large" style={{ color: cinematicTheme.colors.primary }} />
    </div>
  );
}

export default GlobalLoader;
