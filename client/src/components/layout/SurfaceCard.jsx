import PropTypes from "prop-types";
import { theme as cinematicTheme } from "../../styles/theme";

const base =
  "rounded-2xl border p-6 shadow-[0_8px_40px_rgba(0,0,0,0.55)] sm:p-8";

/** Themed bordered panel — settings blocks, summaries, gated content. */
function SurfaceCard({ children, className = "" }) {
  const mergedClass = [base, className].filter(Boolean).join(" ");

  return (
    <section
      className={mergedClass}
      style={{
        backgroundColor: cinematicTheme.colors.card,
        borderColor: cinematicTheme.colors.elevated,
      }}
    >
      {children}
    </section>
  );
}

SurfaceCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

SurfaceCard.defaultProps = {
  className: "",
};

export default SurfaceCard;
