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
import { Button, TagsIcon, Tooltip } from "mds";
import { useSelector } from "react-redux";
import { hasPermission } from "../../../../../../common/SecureComponent";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../../common/SecureComponent/permissions";
import { useParams } from "react-router-dom";
import { setLoadingObjectInfo } from "../../../objectBrowserSlice";
import TagsModal from "../../../../Buckets/ListBuckets/Objects/ObjectDetails/TagsModal";
import { AppState, useAppDispatch } from "../../../../../../store";
import { safeDecodeURIComponent } from "../../../../../../common/utils";

const TagObjectButton = () => {
  const params = useParams();
  const dispatch = useAppDispatch();

  const [tagModalOpen, setTagModalOpen] = useState<boolean>(false);

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

  const canSetTags = hasPermission(objectResources, [
    IAM_SCOPES.S3_PUT_OBJECT_TAGGING,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ]);

  const closeAddTagModal = (reloadObjectData: boolean) => {
    setTagModalOpen(false);
    if (reloadObjectData) {
      dispatch(setLoadingObjectInfo(true));
    }
  };

  return (
    <Fragment>
      {tagModalOpen && actualInfo && (
        <TagsModal
          modalOpen={tagModalOpen}
          bucketName={bucketName}
          actualInfo={actualInfo}
          onCloseAndUpdate={closeAddTagModal}
        />
      )}
      <Tooltip
        tooltip={
          canSetTags
            ? "Change Tags for this File"
            : permissionTooltipHelper(
              [
                IAM_SCOPES.S3_PUT_OBJECT_TAGGING,
                IAM_SCOPES.S3_GET_OBJECT_TAGGING,
                IAM_SCOPES.S3_GET_ACTIONS,
                IAM_SCOPES.S3_PUT_ACTIONS,
              ],
              "set Tags on this object",
            )
        }
      >
        <Button
          id={`preview-file`}
          icon={<TagsIcon />}
          disabled={
            !!actualInfo.is_delete_marker ||
            selectedVersion !== "" ||
            !canSetTags
          }
          onClick={() => {
            setTagModalOpen(true);
          }}
        >
          Tag
        </Button>
      </Tooltip>
    </Fragment>
  );
};

export default TagObjectButton;