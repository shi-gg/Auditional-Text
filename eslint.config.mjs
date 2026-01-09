import { base, recommended } from '@mwlica/eslint';
import tseslint from "typescript-eslint";

export default tseslint.config(
    base,
    recommended,
    {
        rules: {
            "unicorn/filename-case": "off",
            "import/extensions": ["error", "never", {
                "json": "always"
            }]
        }
    }
);
