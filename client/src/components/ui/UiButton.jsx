import { Button as AntButton } from "antd";

/** Maps design variants to Ant Design `type` tokens */
const variantToAntType = {
  primary: "primary",
  secondary: "default",
  dashed: "dashed",
  text: "text",
  link: "link",
};

const emphasisClass = "!font-semibold !text-base shadow-none";

/**
 * Wrapped antd Button — use `variant` for primary vs secondary; keeps `Button` available from antd.
 */
function UiButton({
  variant = "secondary",
  block = false,
  size = "large",
  className = "",
  htmlType,
  ...rest
}) {
  const type = variantToAntType[variant] ?? variantToAntType.secondary;
  const typography =
    variant === "primary" ||
    variant === "secondary" ||
    variant === "dashed"
      ? emphasisClass
      : "";

  const merged = [typography, className].filter(Boolean).join(" ");

  return (
    <AntButton
      block={block}
      type={type}
      size={size}
      htmlType={htmlType}
      className={merged}
      {...rest}
    />
  );
}

export default UiButton;
