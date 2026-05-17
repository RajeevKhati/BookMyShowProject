import PropTypes from "prop-types";
import { theme as cinematicTheme } from "../../styles/theme";

const innerDefaultClass =
  "w-full max-w-xl font-[system-ui,Inter,sans-serif]";

/**
 * Full-viewport centered column (forms, onboarding, empty states).
 * Use `fillViewport={false}` when nesting. `containerClassName` is appended to default width + font utilities.
 */
function CenteredShell({
  children,
  className = "",
  containerClassName = "",
  fillViewport = true,
  backgroundColor,
}) {
  const bg =
    backgroundColor ?? cinematicTheme.colors.background;

  const outerBase = fillViewport
    ? "flex min-h-screen flex-col items-center justify-center px-4 py-10 antialiased text-white"
    : "flex w-full flex-col items-center justify-center px-4 py-6 antialiased text-white";

  const mergedOuter = [outerBase, className].filter(Boolean).join(" ");

  const mergedInner = [innerDefaultClass, containerClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={mergedOuter} style={{ backgroundColor: bg }}>
      <div className={mergedInner}>{children}</div>
    </div>
  );
}

CenteredShell.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  fillViewport: PropTypes.bool,
  backgroundColor: PropTypes.string,
};

CenteredShell.defaultProps = {
  className: "",
  containerClassName: "",
  fillViewport: true,
  backgroundColor: undefined,
};

export default CenteredShell;
