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
import { ExpandMenuOption, Tooltip, ViewIcon } from "mds";
import { useSelector } from "react-redux";
import { hasPermission } from "../../../../../../common/SecureComponent";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../../common/SecureComponent/permissions";
import { useParams } from "react-router-dom";
import {
  setInspectOpen,
  setLoadingObjectInfo,
} from "../../../objectBrowserSlice";
import InspectObject from "../../../../Buckets/ListBuckets/Objects/ListObjects/InspectObject";
import { AppState, useAppDispatch } from "../../../../../../store";
import { safeDecodeURIComponent } from "../../../../../../common/utils";
import { selDistSet } from "../../../../../../systemSlice";

const InspectObjectButton = () => {
  const params = useParams();
  const dispatch = useAppDispatch();

  const [inspectModalOpen, setInspectModalOpen] = useState<boolean>(false);

  const bucketName = params.bucketName || "";

  const actualInfo = useSelector(
    (state: AppState) => state.objectBrowser.objectData.selectedObjectInfo
  );
  const selectedVersion = useSelector(
    (state: AppState) => state.objectBrowser.selectedVersion
  );
  const selectedInternalPaths = useSelector(
    (state: AppState) => state.objectBrowser.selectedInternalPaths
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

  const canInspect = hasPermission(objectResources, [
    IAM_SCOPES.ADMIN_INSPECT_DATA,
  ]);

  const closeInspectModal = (reloadObjectData: boolean) => {
    setInspectModalOpen(false);
    if (reloadObjectData) {
      dispatch(setLoadingObjectInfo(true));
    }
  };

  return (
    <Fragment>
      {inspectModalOpen && actualInfo && (
        <InspectObject
          inspectOpen={inspectModalOpen}
          volumeName={bucketName}
          inspectPath={actualInfo.name || ""}
          closeInspectModalAndRefresh={closeInspectModal}
        />
      )}
      <Tooltip
        tooltip={
          canInspect
            ? "Inspect this file"
            : permissionTooltipHelper(
                [IAM_SCOPES.ADMIN_INSPECT_DATA],
                "inspect this file"
              )
        }
      >
        <ExpandMenuOption
          id={`preview-file`}
          icon={<ViewIcon />}
          disabled={
            !distributedSetup ||
            !!actualInfo.is_delete_marker ||
            selectedVersion !== "" ||
            !canInspect
          }
          onClick={() => {
            dispatch(setInspectOpen(true));
          }}
        >
          Inspect
        </ExpandMenuOption>
      </Tooltip>
    </Fragment>
  );
};

export default InspectObjectButton;
