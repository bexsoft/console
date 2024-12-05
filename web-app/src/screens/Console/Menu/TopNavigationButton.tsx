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

import { styled } from "mds";

const TopNavigatorButton = styled.button(({theme}) => ({
  cursor: "pointer",
  backgroundColor: "transparent",
  border: 0,
  color: theme.colors["Color/Neutral/Icon/colorIcon"],
  opacity: 0.8,
  justifySelf: "flex-end",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& svg": {
    width: 16,
    height: 16,
  },
  "&:hover": {
    opacity: 1,
  },
}));
export default TopNavigatorButton;
