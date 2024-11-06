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
import { Button, DeleteIcon } from "mds";
import { useSelector } from "react-redux";
import { SecureComponent } from "../../../../../../common/SecureComponent";
import { IAM_SCOPES } from "../../../../../../common/SecureComponent/permissions";
import { useParams } from "react-router-dom";
import {
  setLoadingObjectInfo,
  setLoadingVersions,
  setObjectInfo,
  setObjectMetadata,
  setSelectedVersion,
} from "../../../objectBrowserSlice";
import DeleteObject from "../../../../Buckets/ListBuckets/Objects/ListObjects/DeleteObject";
import { AppState, useAppDispatch } from "../../../../../../store";
import { selDistSet } from "../../../../../../systemSlice";
import { safeDecodeURIComponent } from "../../../../../../common/utils";

const DeleteObjectButton = () => {
  const params = useParams();
  const dispatch = useAppDispatch();

  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

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
  const versioningConfig = useSelector(
    (state: AppState) => state.objectBrowser.versionInfo,
  );
  const distributedSetup = useSelector(selDistSet);

  const internalPathsDecoded =
    safeDecodeURIComponent(selectedInternalPaths || "") || "";
  const allPathData = internalPathsDecoded.split("/");
  const currentItem = allPathData.pop() || "";

  if (!actualInfo) {
    return null;
  }

  const closeDeleteModal = (closeAndReload: boolean) => {
    setDeleteOpen(false);

    if (closeAndReload && selectedVersion === "") {
      dispatch(setObjectInfo(null));
      dispatch(setObjectMetadata(null));
    } else {
      dispatch(setLoadingVersions(true));
      dispatch(setSelectedVersion(""));
      dispatch(setLoadingObjectInfo(true));
    }
  };

  return (
    <Fragment>
      {deleteOpen && (
        <DeleteObject
          deleteOpen={deleteOpen}
          selectedBucket={bucketName}
          selectedObject={selectedInternalPaths || ""}
          closeDeleteModalAndRefresh={closeDeleteModal}
          versioningInfo={distributedSetup ? versioningConfig : undefined}
          selectedVersion={selectedVersion}
        />
      )}
      <SecureComponent
        resource={[
          bucketName,
          currentItem,
          [bucketName, actualInfo.name].join("/"),
        ]}
        scopes={[IAM_SCOPES.S3_DELETE_OBJECT]}
        errorProps={{ disabled: true }}
      >
        <Button
          id={"delete-element-click"}
          icon={<DeleteIcon />}
          iconLocation={"start"}
          variant={"secondary"}
          onClick={() => {
            setDeleteOpen(true);
          }}
          disabled={selectedVersion === "" && actualInfo.is_delete_marker}
          label={`Delete${selectedVersion !== "" ? " version" : ""}`}
        />
      </SecureComponent>
    </Fragment>
  );
};

export default DeleteObjectButton;