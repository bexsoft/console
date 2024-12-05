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

import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { IAM_SCOPES } from "../../../../../../common/SecureComponent/permissions";
import { getSessionGrantsWildCard } from "../../../../Buckets/ListBuckets/UploadPermissionUtils";
import { hasPermission } from "../../../../../../common/SecureComponent";
import { Button, ShareIcon, Tooltip } from "mds";
import { openShare } from "../../../objectBrowserThunks";
import { AppState, useAppDispatch } from "../../../../../../store";

const ShareMultipleButton = () => {
  const params = useParams();
  const dispatch = useAppDispatch();

  const bucketName = params.bucketName || "";

  const selectedObjects = useSelector(
    (state: AppState) => state.objectBrowser.selectedObjects,
  );
  const records = useSelector(
    (state: AppState) => state.objectBrowser?.records || [],
  );
  const metadata = useSelector(
    (state: AppState) => state.objectBrowser.objectData.selectedObjectMetadata,
  );
  const sessionGrants = useSelector((state: AppState) =>
    state.console.session ? state.console.session.permissions || {} : {}
  );


  const [canShareFile, setCanShareFile] = useState<boolean>(false);

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

  useEffect(() => {
    if (selectedObjects.length === 1) {
      const objectName = selectedObjects[0];
      const isPrefix = objectName.endsWith("/");

      if (canDownload && !isPrefix) {
        setCanShareFile(true);
      } else {
        setCanShareFile(false);
      }
    } else {
      setCanShareFile(false);
    }
  }, [selectedObjects, canDownload, metadata]);

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

  return (
    <Fragment>
      <Tooltip
        tooltip={canShareFile ? "Share Selected File" : "Sharing unavailable"}
      >
        <Button
          id={"share-multi-element-click"}
          icon={<ShareIcon />}
          iconLocation={"start"}
          onClick={() => {
            dispatch(openShare());
          }}
          disabled={
            selectedObjects.length !== 1 ||
            !canShareFile ||
            isSelObjectDelMarker
          }
        >
          Share
        </Button>
      </Tooltip>
    </Fragment>
  );
};

export default ShareMultipleButton;