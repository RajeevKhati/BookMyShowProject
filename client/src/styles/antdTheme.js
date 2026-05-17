import { theme as antTheme } from "antd";
import { theme as cinematicTheme } from "./theme";

/**
 * Shared Ant Design theme — single source wired to cinematicTheme.
 * Imported by ConfigProvider at the app root (`AppProviders`).
 */
export const antdAppThemeConfig = {
  algorithm: antTheme.darkAlgorithm,
  token: {
    colorPrimary: cinematicTheme.colors.primary,
    colorLink: cinematicTheme.colors.primary,
    colorSuccess: cinematicTheme.colors.success,
    colorWarning: cinematicTheme.colors.warning,
    colorError: cinematicTheme.colors.error,
    colorText: cinematicTheme.colors.text,
    colorTextSecondary: cinematicTheme.colors.textSecondary,
    colorBgContainer: cinematicTheme.colors.backgroundSecondary,
    colorBorder: "#333333",
    colorSplit: "#2a2a2a",
    borderRadius: 8,
    borderRadiusLG: 16,
  },
  components: {
    Button: {
      borderRadiusLG: 12,
      controlHeightLG: 48,
      fontWeightStrong: 600,
    },
    Input: {
      hoverBorderColor: cinematicTheme.colors.muted,
      activeBorderColor: cinematicTheme.colors.primary,
    },
    Form: {
      labelColor: cinematicTheme.colors.textSecondary,
      verticalLabelPadding: "0 0 8px",
    },
  },
};
