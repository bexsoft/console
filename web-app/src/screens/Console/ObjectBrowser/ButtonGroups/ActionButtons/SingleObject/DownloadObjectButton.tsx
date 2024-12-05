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
import { Button, DownloadIcon, Tooltip } from "mds";
import { useSelector } from "react-redux";
import { hasPermission } from "../../../../../../common/SecureComponent";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../../common/SecureComponent/permissions";
import { useParams } from "react-router-dom";
import { downloadObject } from "../../../utils";
import { AppState, useAppDispatch } from "../../../../../../store";
import { safeDecodeURIComponent } from "../../../../../../common/utils";

interface IDownloadButtonProps {
  fullButton?: boolean;
}

const DownloadObjectButton = ({fullButton} : IDownloadButtonProps) => {
  const params = useParams();
  const dispatch = useAppDispatch();

  const bucketName = params.bucketName || "";

  const actualInfo = useSelector(
    (state: AppState) => state.objectBrowser.objectData.selectedObjectInfo
  );
  const selectedInternalPaths = useSelector(
    (state: AppState) => state.objectBrowser.selectedInternalPaths
  );

  if (!actualInfo || !selectedInternalPaths) {
    return null;
  }

  const internalPathsDecoded =
    safeDecodeURIComponent(selectedInternalPaths) || "";
  const allPathData = internalPathsDecoded.split("/");
  const currentItem = allPathData.pop() || "";

  const objectResources = [
    bucketName,
    currentItem,
    [bucketName, actualInfo.name].join("/"),
  ];

  const canGetObject = hasPermission(objectResources, [
    IAM_SCOPES.S3_GET_OBJECT,
    IAM_SCOPES.S3_GET_ACTIONS,
  ]);

  return (
    <Fragment>
      <Tooltip
        tooltip={
          canGetObject
            ? "Download this Object"
            : permissionTooltipHelper(
                [IAM_SCOPES.S3_GET_OBJECT, IAM_SCOPES.S3_GET_ACTIONS],
                "download this object"
              )
        }
      >
        <Button
          id={`download-file`}
          icon={<DownloadIcon />}
          disabled={!!actualInfo.is_delete_marker || !canGetObject}
          label={fullButton ? "Download" : ""}
          onClick={() => {
            downloadObject(
              dispatch,
              bucketName,
              selectedInternalPaths,
              actualInfo
            );
          }}
          compact={fullButton}
        />
      </Tooltip>
    </Fragment>
  );
};

export default DownloadObjectButton;
