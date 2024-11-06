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

import { useSelector } from "react-redux";
import {
  Box,
  Button,
  ButtonGroup,
  EllipsisVerticalIcon,
  ExpandMenu,
  XIcon,
} from "mds";

import AnonymousMultipleButton from "./ActionButtons/MultiObjects/AnonymousMultipeButton";
import DeleteMultipleButton from "./ActionButtons/MultiObjects/DeleteMultipleButton";
import DownloadMultipleButton from "./ActionButtons/MultiObjects/DownloadMultipleButton";
import PreviewMultipleButton from "./ActionButtons/MultiObjects/PreviewMultipleButton";
import ShareMultipleButton from "./ActionButtons/MultiObjects/ShareMultipleButton";
import { AppState, useAppDispatch } from "../../../../store";
import MultiActionModals from "./MenuActionModals/MultiActionModals";
import { setSelectedObjects } from "../objectBrowserSlice";
import MultipleBase from "../../../../common/MultipleBase";

const MultipleObjectSelection = () => {
  const dispatch = useAppDispatch();
  const selectedObjects = useSelector(
    (state: AppState) => state.objectBrowser.selectedObjects,
  );

  return (
    <MultipleBase>
      <MultiActionModals />
      <Box className={"detSelection"}>
        <Button
          id={"clean-selection"}
          icon={<XIcon />}
          onClick={() => {
            dispatch(setSelectedObjects([]));
          }}
          compact
          sx={{
            width: 26,
            padding: 0,
          }}
        ></Button>
        <span className={"selectionElm"}>
          <strong>
            {selectedObjects.length} Object
            {selectedObjects.length === 1 ? "" : "s"} selected
          </strong>
        </span>
      </Box>
      <ButtonGroup>
        <ShareMultipleButton />
        <DownloadMultipleButton />
        <PreviewMultipleButton />
        <ExpandMenu
          id={"expand-options"}
          icon={<EllipsisVerticalIcon />}
          dropMenuPosition={"end"}
          dropArrow={false}
        >
          <AnonymousMultipleButton />
          <DeleteMultipleButton />
        </ExpandMenu>
      </ButtonGroup>
    </MultipleBase>
  );
};

export default MultipleObjectSelection;
