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
import { Button, FeatherIcon, Tooltip } from "mds";
import { useSelector } from "react-redux";
import { hasPermission } from "../../../../../../common/SecureComponent";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../../common/SecureComponent/permissions";
import { useParams } from "react-router-dom";
import { setVersionsModeEnabled } from "../../../objectBrowserSlice";
import { AppState, useAppDispatch } from "../../../../../../store";
import { selDistSet } from "../../../../../../systemSlice";
import { safeDecodeURIComponent } from "../../../../../../common/utils";

const ObjectVersionsButton = () => {
  const params = useParams();
  const dispatch = useAppDispatch();

  const bucketName = params.bucketName || "";

  const actualInfo = useSelector(
    (state: AppState) => state.objectBrowser.objectData.selectedObjectInfo,
  );
  const selectedInternalPaths = useSelector(
    (state: AppState) => state.objectBrowser.selectedInternalPaths,
  );
  const versionsMode = useSelector(
    (state: AppState) => state.objectBrowser.versionsMode,
  );
  const distributedSetup = useSelector(selDistSet);

  const internalPathsDecoded =
    safeDecodeURIComponent(selectedInternalPaths || "") || "";
  const allPathData = internalPathsDecoded.split("/");
  const currentItem = allPathData.pop() || "";

  if (!actualInfo) {
    return null;
  }

  const objectResources = [
    bucketName,
    currentItem,
    [bucketName, actualInfo.name].join("/"),
  ];

  const canChangeVersioning = hasPermission(objectResources, [
    IAM_SCOPES.S3_GET_BUCKET_VERSIONING,
    IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
    IAM_SCOPES.S3_GET_OBJECT_VERSION,
    IAM_SCOPES.S3_GET_ACTIONS,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ]);

  // calculate object name to display
  let objectNameArray: string[] = [];
  if (actualInfo && actualInfo.name) {
    objectNameArray = actualInfo.name.split("/");
  }

  const objectName =
    objectNameArray.length > 0
      ? objectNameArray[objectNameArray.length - 1]
      : actualInfo.name;

  return (
    <Fragment>
      <Tooltip
        tooltip={
          canChangeVersioning
            ? actualInfo.version_id && actualInfo.version_id !== "null"
              ? "Display Versions for this file"
              : ""
            : permissionTooltipHelper(
              [
                IAM_SCOPES.S3_GET_BUCKET_VERSIONING,
                IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
                IAM_SCOPES.S3_GET_OBJECT_VERSION,
                IAM_SCOPES.S3_GET_ACTIONS,
                IAM_SCOPES.S3_PUT_ACTIONS,
              ],
              "display all versions of this object",
            )
        }
      >
        <Button
          id={`preview-file`}
          icon={<FeatherIcon />}
          disabled={
            !distributedSetup ||
            !(actualInfo.version_id && actualInfo.version_id !== "null") ||
            !canChangeVersioning
          }
          onClick={() => {
            dispatch(
              setVersionsModeEnabled({
                status: !versionsMode,
                objectName: objectName,
              }),
            );
          }}
        >
          {versionsMode ? "Hide Object Versions" : "Display Object Versions"}
        </Button>
      </Tooltip>
    </Fragment>
  );
};

export default ObjectVersionsButton;