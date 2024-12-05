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
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../../common/SecureComponent/permissions";
import { useParams } from "react-router-dom";
import { hasPermission } from "../../../../../../common/SecureComponent";
import { getSessionGrantsWildCard } from "../../../../Buckets/ListBuckets/UploadPermissionUtils";
import { downloadSelected } from "../../../objectBrowserThunks";
import { AppState, useAppDispatch } from "../../../../../../store";

const DeleteObjectButton = () => {
  const params = useParams();
  const dispatch = useAppDispatch();

  const selectedObjects = useSelector(
    (state: AppState) => state.objectBrowser.selectedObjects,
  );
  const records = useSelector(
    (state: AppState) => state.objectBrowser?.records || [],
  );
  const sessionGrants = useSelector((state: AppState) =>
    state.console.session ? state.console.session.permissions || {} : {}
  );


  const bucketName = params.bucketName || "";

  let uploadPath = [bucketName];
  const putObjectPermScopes = [
    IAM_SCOPES.S3_PUT_OBJECT,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ];

  const pathAsResourceInPolicy = uploadPath.join("/");

  const sessionGrantWildCards = getSessionGrantsWildCard(
    sessionGrants,
    pathAsResourceInPolicy,
    putObjectPermScopes,
  );

  const canDownload = hasPermission(
    [pathAsResourceInPolicy, ...sessionGrantWildCards],
    [IAM_SCOPES.S3_GET_OBJECT, IAM_SCOPES.S3_GET_ACTIONS],
  );

  const checkForDelMarker = (): boolean => {
    let isObjDelMarker = false;
    if (selectedObjects.length === 1) {
      let matchingRec = records.find((obj) => {
        return obj.name === `${selectedObjects[0]}` && obj.delete_flag;
      });

      isObjDelMarker = !!matchingRec;
    }
    return isObjDelMarker;
  };

  const isSelObjectDelMarker = checkForDelMarker();

  const downloadToolTip =
    selectedObjects?.length <= 1
      ? "Download Selected"
      : ` Download selected objects as Zip. Any Deleted objects in the selection would be skipped from download.`;

  return (
    <Fragment>
      <Tooltip
        tooltip={
          canDownload
            ? downloadToolTip
            : permissionTooltipHelper(
              [IAM_SCOPES.S3_GET_OBJECT, IAM_SCOPES.S3_GET_ACTIONS],
              "download objects from this bucket",
            )
        }
      >
        <Button
          id={"download-multi-element-click"}
          icon={<DownloadIcon />}
          iconLocation={"start"}
          onClick={() => {
            dispatch(downloadSelected(bucketName));
          }}
          disabled={!canDownload || isSelObjectDelMarker}
        >
          Download
        </Button>
      </Tooltip>
    </Fragment>
  );
};

export default DeleteObjectButton;