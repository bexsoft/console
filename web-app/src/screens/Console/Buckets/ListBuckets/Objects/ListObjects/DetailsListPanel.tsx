// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import React from "react";
import { Box, Button, ArrowRightToLineIcon } from "mds";

interface IDetailsListPanel {
  open: boolean;
  className?: string;
  children: React.ReactNode;
}

const DetailsListPanel = ({
  open,
  className = "",
  children,
}: IDetailsListPanel) => {
  return (
    <Box
      id={"details-panel"}
      sx={{
        width: 0,
        transitionDuration: "0.3s",
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
        opacity: 0,
        marginLeft: -1,
        "&.open": {
          width: 300,
          minWidth: 300,
          opacity: 1,
        },
        "@media (max-width: 799px)": {
          "&.open": {
            width: "100%",
            minWidth: "100%",
            borderLeftWidth: 0,
          },
        },
      }}
      className={`${open ? "open" : ""} ${className}`}
    >
      {children}
    </Box>
  );
};

export default DetailsListPanel;
