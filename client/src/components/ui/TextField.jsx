import { Input } from "antd";

/**
 * Unified form field wrapping antd Input. Use `password` for masked entry (Input.Password).
 */
function TextField({ password = false, size = "large", type, ...rest }) {
  if (password) {
    return <Input.Password size={size} {...rest} />;
  }

  return <Input size={size} type={type} {...rest} />;
}

export default TextField;
