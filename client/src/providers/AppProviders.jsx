import PropTypes from "prop-types";
import { ConfigProvider } from "antd";
import { antdAppThemeConfig } from "../styles/antdTheme";

/**
 * Root composition for cross-cutting providers (antd theme, locale, etc.).
 * Keep this shallow—add Redux/router here only if consolidating entry wiring.
 */
function AppProviders({ children }) {
  return (
    <ConfigProvider theme={antdAppThemeConfig}>{children}</ConfigProvider>
  );
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProviders;
