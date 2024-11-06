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
import { Button, FeatherIcon, Tooltip } from "mds";
import { useSelector } from "react-redux";
import { hasPermission } from "../../../../../../common/SecureComponent";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../../common/SecureComponent/permissions";
import { useParams } from "react-router-dom";
import { setLoadingObjectInfo } from "../../../objectBrowserSlice";
import SetRetention from "../../../../Buckets/ListBuckets/Objects/ObjectDetails/SetRetention";
import { AppState, useAppDispatch } from "../../../../../../store";
import { safeDecodeURIComponent } from "../../../../../../common/utils";
import { selDistSet } from "../../../../../../systemSlice";

const RetentionObjectButton = () => {
  const params = useParams();
  const dispatch = useAppDispatch();

  const [retentionModalOpen, setRetentionModalOpen] = useState<boolean>(false);

  const bucketName = params.bucketName || "";

  const actualInfo = useSelector(
    (state: AppState) => state.objectBrowser.objectData.selectedObjectInfo,
  );
  const selectedVersion = useSelector(
    (state: AppState) => state.objectBrowser.selectedVersion,
  );
  const lockingEnabled = useSelector(
    (state: AppState) => state.objectBrowser.lockingEnabled,
  );
  const selectedInternalPaths = useSelector(
    (state: AppState) => state.objectBrowser.selectedInternalPaths,
  );

  const internalPathsDecoded =
    safeDecodeURIComponent(selectedInternalPaths || "") || "";
  const allPathData = internalPathsDecoded.split("/");
  const currentItem = allPathData.pop() || "";

  const distributedSetup = useSelector(selDistSet);

  if (!actualInfo) {
    return null;
  }

  const objectResources = [
    bucketName,
    currentItem,
    [bucketName, actualInfo.name].join("/"),
  ];

  const canChangeRetention = hasPermission(
    objectResources,
    [
      IAM_SCOPES.S3_GET_OBJECT_RETENTION,
      IAM_SCOPES.S3_PUT_OBJECT_RETENTION,
      IAM_SCOPES.S3_GET_ACTIONS,
      IAM_SCOPES.S3_PUT_ACTIONS,
    ],
    true,
  );

  const closeRetentionModal = (updateInfo: boolean) => {
    setRetentionModalOpen(false);
    if (updateInfo) {
      dispatch(setLoadingObjectInfo(true));
    }
  };

  return (
    <Fragment>
      {retentionModalOpen && actualInfo && (
        <SetRetention
          open={retentionModalOpen}
          closeModalAndRefresh={closeRetentionModal}
          objectName={currentItem}
          objectInfo={actualInfo}
          bucketName={bucketName}
        />
      )}
      <Tooltip
        tooltip={
          canChangeRetention
            ? lockingEnabled
              ? "Change Retention rules for this File"
              : "Object Locking must be enabled on this bucket in order to set Retention Rules"
            : permissionTooltipHelper(
              [
                IAM_SCOPES.S3_GET_OBJECT_RETENTION,
                IAM_SCOPES.S3_PUT_OBJECT_RETENTION,
                IAM_SCOPES.S3_GET_ACTIONS,
                IAM_SCOPES.S3_PUT_ACTIONS,
              ],
              "change Retention Rules for this object",
            )
        }
      >
        <Button
          id={`preview-file`}
          icon={<FeatherIcon />}
          disabled={
            !distributedSetup ||
            !!actualInfo.is_delete_marker ||
            !canChangeRetention ||
            selectedVersion !== "" ||
            !lockingEnabled
          }
          onClick={() => {
            setRetentionModalOpen(true);
          }}
        >
          Retention
        </Button>
      </Tooltip>
    </Fragment>
  );
};

export default RetentionObjectButton;