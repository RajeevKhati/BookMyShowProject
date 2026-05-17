import PropTypes from "prop-types";
import { App, ConfigProvider } from "antd";
import GlobalLoader from "../components/GlobalLoader";
import NotifyHost from "../components/NotifyHost";
import { antdAppThemeConfig } from "../styles/antdTheme";
import "../styles/feedback.css";

/**
 * Theme, `message` / `notification` context (placement, duration), global loader.
 */
function AppProviders({ children }) {
  return (
    <ConfigProvider theme={antdAppThemeConfig}>
      <App
        message={{ top: 24, maxCount: 4, duration: 4 }}
        notification={{ placement: "topRight", top: 24, duration: 4 }}
      >
        <NotifyHost />
        <GlobalLoader />
        {children}
      </App>
    </ConfigProvider>
  );
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProviders;
