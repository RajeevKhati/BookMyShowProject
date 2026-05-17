import { Radio } from "antd";

/**
 * Responsive radio group: stacks on narrow viewports, row on md+ (auth / filters).
 */
function RadioRowGroup({ className = "", ...rest }) {
  const layout = "flex w-full flex-col gap-3 sm:flex-row sm:gap-8";
  const merged = [layout, className].filter(Boolean).join(" ");
  return <Radio.Group className={merged} {...rest} />;
}

export default RadioRowGroup;
