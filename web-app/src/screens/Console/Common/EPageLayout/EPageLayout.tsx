// This file is part of MinIO Console Server
// Copyright (c) 2024 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { ReactNode } from "react";
import { Box, overridePropsParse, OverrideTheme } from "mds";

const EPageLayout = ({
  children,
  sx,
  id,
  withBackground = true,
}: {
  children: ReactNode | ReactNode[];
  sx?: OverrideTheme;
  id?: string;
  withBackground?: boolean;
}) => {
  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        backgroundColor: withBackground
          ? theme.colors["Color/Neutral/Bg/colorBgContainer"]
          : "inherit",
        "& > .box:first-of-type": {
          flexGrow: 1,
          boxShadow: "unset",
        },
        ...overridePropsParse(sx, theme),
      })}
      id={id}
      className={"epage-layout"}
    >
      {children}
    </Box>
  );
};

export default EPageLayout;
