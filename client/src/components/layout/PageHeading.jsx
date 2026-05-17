import PropTypes from "prop-types";
import { theme as cinematicTheme } from "../../styles/theme";

/**
 * Title block with optional eyebrow + subtitle — marketing pages, flows, dialogs.
 */
function PageHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}) {
  const alignClass =
    align === "left" ? "text-left" : "text-center";

  return (
    <header className={`mb-8 ${alignClass}`}>
      {eyebrow != null && eyebrow !== "" ? (
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-[0.22em]"
          style={{ color: cinematicTheme.colors.primary }}
        >
          {eyebrow}
        </p>
      ) : null}
      <h1 className="m-0 text-3xl font-bold tracking-tight">{title}</h1>
      {subtitle != null && subtitle !== "" ? (
        <p
          className="mt-2 mb-0 text-base leading-relaxed"
          style={{ color: cinematicTheme.colors.textSecondary }}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

PageHeading.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.string,
  align: PropTypes.oneOf(["center", "left"]),
};

PageHeading.defaultProps = {
  eyebrow: undefined,
  subtitle: undefined,
  align: "center",
};

export default PageHeading;
