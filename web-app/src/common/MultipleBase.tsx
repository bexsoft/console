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

import { styled } from "mds";

const MultipleBase = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: 4,
  borderRadius: 12,
  backgroundColor: theme.colors["Color/Neutral/Bg/colorBgShell"],
  "& #expand-options .button-label": {
    display: "none",
  },
  "& .selectionElm": {
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: 600,
    lineHeight: "16px",
    letterSpacing: "0.5px",
  },
  "& .detSelection": {
    display: "flex",
    alignItems: "center",
    gap: 24,
    padding: "0 4px",
  },
}));

export default MultipleBase;
