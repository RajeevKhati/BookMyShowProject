/**
 * Shared dayjs instance with plugins used across the app.
 * Prefer `import dayjs from "../utils/dayjs"` instead of `"dayjs"` so formats stay consistent.
 */
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);

export default dayjs;
