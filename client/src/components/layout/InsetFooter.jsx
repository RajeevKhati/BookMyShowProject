import PropTypes from "prop-types";
import { theme as cinematicTheme } from "../../styles/theme";

/** Muted footnote strip under a card or section — links, legal, helper copy. */
function InsetFooter({ children, className = "" }) {
  const mergedClass =
    ["mt-8 text-center text-sm", className].filter(Boolean).join(" ");

  return (
    <footer
      className={mergedClass}
      style={{ color: cinematicTheme.colors.textSecondary }}
    >
      {children}
    </footer>
  );
}

InsetFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

InsetFooter.defaultProps = {
  className: "",
};

export default InsetFooter;
