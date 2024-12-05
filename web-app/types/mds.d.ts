import { ThemeDefinition } from "mds";

import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme extends ThemeDefinition {}
}
