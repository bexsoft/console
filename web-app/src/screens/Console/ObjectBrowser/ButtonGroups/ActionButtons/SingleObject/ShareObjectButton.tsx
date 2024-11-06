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

import React, { Fragment, useState } from "react";
import { Button, ShareIcon, Tooltip } from "mds";
import { useSelector } from "react-redux";
import { hasPermission } from "../../../../../../common/SecureComponent";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../../common/SecureComponent/permissions";
import { useParams } from "react-router-dom";
import ShareFile from "../../../../Buckets/ListBuckets/Objects/ObjectDetails/ShareFile";
import { AppState } from "../../../../../../store";
import { safeDecodeURIComponent } from "../../../../../../common/utils";

const ShareObjectButton = () => {
  const params = useParams();

  const [shareFileModalOpen, setShareFileModalOpen] = useState<boolean>(false);

  const bucketName = params.bucketName || "";

  const actualInfo = useSelector(
    (state: AppState) => state.objectBrowser.objectData.selectedObjectInfo,
  );
  const selectedInternalPaths = useSelector(
    (state: AppState) => state.objectBrowser.selectedInternalPaths,
  );

  if (!actualInfo || !selectedInternalPaths) {
    return null;
  }

  const internalPathsDecoded = safeDecodeURIComponent(selectedInternalPaths) || "";
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
      {shareFileModalOpen && actualInfo && (
        <ShareFile
          open={shareFileModalOpen}
          closeModalAndRefresh={() => {
            setShareFileModalOpen(false);
          }}
          bucketName={bucketName}
          dataObject={actualInfo}
        />
      )}
      <Tooltip
        tooltip={
          canGetObject
            ? "Share this File"
            : permissionTooltipHelper(
              [IAM_SCOPES.S3_GET_OBJECT, IAM_SCOPES.S3_GET_ACTIONS],
              "share this object",
            )
        }
      >
        <Button
          id={`preview-file`}
          icon={<ShareIcon />}
          disabled={!!actualInfo.is_delete_marker || !canGetObject}
          onClick={() => {
            setShareFileModalOpen(true);
          }}
        />
      </Tooltip>
    </Fragment>
  );
};

export default ShareObjectButton;