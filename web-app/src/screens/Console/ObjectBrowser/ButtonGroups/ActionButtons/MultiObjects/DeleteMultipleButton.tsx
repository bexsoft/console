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
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../../common/SecureComponent/permissions";
import { hasPermission } from "../../../../../../common/SecureComponent";
import { Button, DeleteIcon, Tooltip } from "mds";
import { getSessionGrantsWildCard } from "../../../../Buckets/ListBuckets/UploadPermissionUtils";
import DeleteMultipleObjects from "../../../../Buckets/ListBuckets/Objects/ListObjects/DeleteMultipleObjects";
import {
  setReloadObjectsList,
  setSelectedObjects,
} from "../../../objectBrowserSlice";
import { AppState, useAppDispatch } from "../../../../../../store";
import { setSnackBarMessage } from "../../../../../../systemSlice";
import { safeDecodeURIComponent } from "../../../../../../common/utils";

const DeleteMultipleButton = () => {
  const params = useParams();
  const dispatch = useAppDispatch();

  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState<boolean>(false);

  const selectedObjects = useSelector(
    (state: AppState) => state.objectBrowser.selectedObjects,
  );

  const versioningConfig = useSelector(
    (state: AppState) => state.objectBrowser.versionInfo,
  );

  const bucketName = params.bucketName || "";

  let uploadPath = [bucketName];

  const sessionGrants = useSelector((state: AppState) =>
    state.console.session ? state.console.session.permissions || {} : {}
  );


  const pathAsResourceInPolicy = uploadPath.join("/");

  const putObjectPermScopes = [
    IAM_SCOPES.S3_PUT_OBJECT,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ];

  const sessionGrantWildCards = getSessionGrantsWildCard(
    sessionGrants,
    pathAsResourceInPolicy,
    putObjectPermScopes,
  );

  const canDelete = hasPermission(
    [pathAsResourceInPolicy, ...sessionGrantWildCards],
    [IAM_SCOPES.S3_DELETE_OBJECT],
  );

  const closeDeleteMultipleModalAndRefresh = (refresh: boolean) => {
    setDeleteMultipleOpen(false);

    if (refresh) {
      dispatch(setSnackBarMessage(`Objects deleted successfully.`));
      dispatch(setSelectedObjects([]));
      dispatch(setReloadObjectsList(true));
    }
  };

  return (
    <Fragment>
      {deleteMultipleOpen && (
        <DeleteMultipleObjects
          deleteOpen={deleteMultipleOpen}
          selectedBucket={bucketName}
          selectedObjects={selectedObjects}
          closeDeleteModalAndRefresh={closeDeleteMultipleModalAndRefresh}
          versioning={versioningConfig}
        />
      )}
      <Tooltip
        tooltip={
          canDelete
            ? "Delete Selected Files"
            : permissionTooltipHelper(
              [IAM_SCOPES.S3_DELETE_OBJECT],
              "delete objects in this bucket",
            )
        }
      >
        <Button
          id={"delete-multi-element-click"}
          icon={<DeleteIcon />}
          variant={"secondary"}
          iconLocation={"start"}
          onClick={() => {
            setDeleteMultipleOpen(true);
          }}
          disabled={!canDelete || selectedObjects.length === 0}
        >
          Delete
        </Button>
      </Tooltip>
    </Fragment>
  );
};

export default DeleteMultipleButton;