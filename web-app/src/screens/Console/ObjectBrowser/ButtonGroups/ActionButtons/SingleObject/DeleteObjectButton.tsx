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

import React, { Fragment } from "react";
import { ExpandMenuOption, TrashIcon } from "mds";
import { useSelector } from "react-redux";
import { SecureComponent } from "../../../../../../common/SecureComponent";
import { IAM_SCOPES } from "../../../../../../common/SecureComponent/permissions";
import { useParams } from "react-router-dom";
import {
  setDeleteObjectOpen,
} from "../../../objectBrowserSlice";
import { AppState, useAppDispatch } from "../../../../../../store";
import { safeDecodeURIComponent } from "../../../../../../common/utils";

const DeleteObjectButton = () => {
  const params = useParams();
  const dispatch = useAppDispatch();

  const bucketName = params.bucketName || "";

  const actualInfo = useSelector(
    (state: AppState) => state.objectBrowser.objectData.selectedObjectInfo,
  );
  const selectedVersion = useSelector(
    (state: AppState) => state.objectBrowser.selectedVersion,
  );
  const selectedInternalPaths = useSelector(
    (state: AppState) => state.objectBrowser.selectedInternalPaths,
  );

  const internalPathsDecoded =
    safeDecodeURIComponent(selectedInternalPaths || "") || "";
  const allPathData = internalPathsDecoded.split("/");
  const currentItem = allPathData.pop() || "";

  if (!actualInfo) {
    return null;
  }

  return (
    <Fragment>
      <SecureComponent
        resource={[
          bucketName,
          currentItem,
          [bucketName, actualInfo.name].join("/"),
        ]}
        scopes={[IAM_SCOPES.S3_DELETE_OBJECT]}
        errorProps={{ disabled: true }}
      >
        <ExpandMenuOption
          id={"delete-element-click"}
          icon={<TrashIcon />}
          className={"danger"}
          onClick={() => {
            dispatch(setDeleteObjectOpen(true));
          }}
          disabled={selectedVersion === "" && actualInfo.is_delete_marker}
        >
          {`Delete${selectedVersion !== "" ? " version" : ""}`}
        </ExpandMenuOption>
      </SecureComponent>
    </Fragment>
  );
};

export default DeleteObjectButton;