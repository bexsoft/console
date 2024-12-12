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
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../../common/SecureComponent/permissions";
import { hasPermission } from "../../../../../../common/SecureComponent";
import { ExpandMenuOption, Tooltip, Trash2Icon } from "mds";
import { getSessionGrantsWildCard } from "../../../../Buckets/ListBuckets/UploadPermissionUtils";
import {
  setDeleteMultipleOpen,
} from "../../../objectBrowserSlice";
import { AppState, useAppDispatch } from "../../../../../../store";

const DeleteMultipleButton = () => {
  const params = useParams();
  const dispatch = useAppDispatch();


  const selectedObjects = useSelector(
    (state: AppState) => state.objectBrowser.selectedObjects,
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

  return (
    <Fragment>
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
        <ExpandMenuOption
          id={"delete-multi-element-click"}
          icon={<Trash2Icon />}
          variant={"secondary"}
          onClick={() => {
            dispatch(setDeleteMultipleOpen(true));
          }}
          disabled={!canDelete || selectedObjects.length === 0}
          className={"danger"}
        >
          Delete Selected
        </ExpandMenuOption>
      </Tooltip>
    </Fragment>
  );
};

export default DeleteMultipleButton;