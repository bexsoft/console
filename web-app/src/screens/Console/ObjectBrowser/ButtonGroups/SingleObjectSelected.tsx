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

import { Box, ButtonGroup, EllipsisVerticalIcon, ExpandMenu } from "mds";

import DeleteObjectButton from "./ActionButtons/SingleObject/DeleteObjectButton";
import DownloadObjectButton from "./ActionButtons/SingleObject/DownloadObjectButton";
import InspectObjectButton from "./ActionButtons/SingleObject/InspectObjectButton";
import LegalHoldObjectButton from "./ActionButtons/SingleObject/LegalHoldObjectButton";
import ObjectVersionsButton from "./ActionButtons/SingleObject/ObjectVersionsButton";
import PreviewObjectButton from "./ActionButtons/SingleObject/PreviewObjectButton";
import RetentionObjectButton from "./ActionButtons/SingleObject/RetentionObjectButton";
import ShareObjectButton from "./ActionButtons/SingleObject/ShareObjectButton";
import SingleActionModals from "./MenuActionModals/SingleActionModals";

const SingleObjectSelected = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 8
      }}
    >
      <SingleActionModals />
      <ButtonGroup
        sx={{
          flexGrow: 1,
          "& > span, > button": {
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "& button": {
              width: "100%",
            },
          },
        }}

      >
        <PreviewObjectButton />
        <ShareObjectButton />
        <DownloadObjectButton />
      </ButtonGroup>
      <ExpandMenu
        id={"expand-object-opts"}
        icon={<EllipsisVerticalIcon />}
        dropMenuPosition={"end"}
        dropArrow={false}
        compact
      >
        <LegalHoldObjectButton />
        <InspectObjectButton />
        <RetentionObjectButton />
        <ObjectVersionsButton />
        <DeleteObjectButton />
      </ExpandMenu>
    </Box>
  );
};

export default SingleObjectSelected;
