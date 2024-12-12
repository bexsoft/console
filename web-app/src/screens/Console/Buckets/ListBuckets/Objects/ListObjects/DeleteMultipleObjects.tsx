// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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
import { ErrorResponseHandler } from "../../../../../../common/types";
import useApi from "../../../../Common/Hooks/useApi";
import ConfirmDialog from "../../../../Common/ModalWrapper/ConfirmDialog";
import { CircleXIcon, NotificationAlert, Toggle, Trash2Icon, TrashIcon } from "mds";
import { setErrorSnackMessage } from "../../../../../../systemSlice";
import { AppState, useAppDispatch } from "../../../../../../store";
import { hasPermission } from "../../../../../../common/SecureComponent";
import { IAM_SCOPES } from "../../../../../../common/SecureComponent/permissions";
import { useSelector } from "react-redux";
import { BucketVersioningResponse } from "api/consoleApi";
import { api } from "../../../../../../api";

interface IDeleteObjectProps {
  closeDeleteModalAndRefresh: (refresh: boolean) => void;
  deleteOpen: boolean;
  selectedObjects: string[];
  selectedBucket: string;

  versioning: BucketVersioningResponse;
}

const DeleteMultipleObjects = ({
  closeDeleteModalAndRefresh,
  deleteOpen,
  selectedBucket,
  selectedObjects,

  versioning,
}: IDeleteObjectProps) => {
  const dispatch = useAppDispatch();
  const onDelSuccess = () => closeDeleteModalAndRefresh(true);
  const onDelError = (err: ErrorResponseHandler) =>
    dispatch(setErrorSnackMessage(err));
  const onClose = () => closeDeleteModalAndRefresh(false);

  const [deleteLoading, invokeDeleteApi] = useApi(onDelSuccess, onDelError);

  const [deleteVersions, setDeleteVersions] = useState<boolean>(false);
  const [bypassGovernance, setBypassGovernance] = useState<boolean>(false);

  const retentionConfig = useSelector(
    (state: AppState) => state.objectBrowser.retentionConfig,
  );

  const canBypass =
    hasPermission(
      [selectedBucket],
      [IAM_SCOPES.S3_BYPASS_GOVERNANCE_RETENTION],
    ) && retentionConfig?.mode === "governance";

  if (!selectedObjects) {
    return null;
  }
  const onConfirmDelete = () => {
    let toSend = [];
    for (let i = 0; i < selectedObjects.length; i++) {
      if (selectedObjects[i].endsWith("/")) {
        toSend.push({
          path: selectedObjects[i],
          versionID: "",
          recursive: true,
        });
      } else {
        toSend.push({
          path: selectedObjects[i],
          versionID: "",
          recursive: false,
        });
      }
    }

    if (toSend) {
      if (selectedObjects.length === 1) {
        const firstObject = selectedObjects[0];
        api.buckets
          .deleteObject(selectedBucket, {
            prefix: firstObject,
            all_versions: deleteVersions,
            bypass: bypassGovernance,
            recursive: firstObject.endsWith("/"), //if it is just a prefix
          })
          .then(onDelSuccess)
          .catch((err) => {
            dispatch(
              setErrorSnackMessage({
                errorMessage: `Could not delete object. ${err.statusText}. ${
                  retentionConfig
                    ? "Please check retention mode and if object is WORM protected."
                    : ""
                }`,
                detailedError: "",
              }),
            );
          });
      } else {
        invokeDeleteApi(
          "POST",
          `/api/v1/buckets/${selectedBucket}/delete-objects?all_versions=${deleteVersions}${
            bypassGovernance ? "&bypass=true" : ""
          }`,
          toSend,
        );
      }
    }
  };

  const isVersionedDelete =
    versioning?.status === "Enabled" || versioning?.status === "Suspended";

  return (
    <ConfirmDialog
      title={`Delete Selected Objects`}
      confirmText={"Delete"}
      isOpen={deleteOpen}
      titleIcon={<Trash2Icon />}
      isLoading={deleteLoading}
      onConfirm={onConfirmDelete}
      onClose={onClose}
      dialogWidth={400}
      confirmationContent={
        <Fragment>
          Are you sure you want to delete the selected {selectedObjects.length === 1 ? "object" : `${selectedObjects.length} objects`}?
          {isVersionedDelete && (
            <Fragment>
              <br />
              <br />
              <Toggle
                label={"Delete All Versions"}
                indicatorLabels={["Yes", "No"]}
                checked={deleteVersions}
                value={"delete_versions"}
                id="delete-versions"
                name="delete-versions"
                onChange={(e) => {
                  setDeleteVersions(!deleteVersions);
                }}
                helper=""
              />
              {canBypass && deleteVersions && (
                <Fragment>
                  <div
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <Toggle
                      label={"Bypass Governance Mode"}
                      indicatorLabels={["Yes", "No"]}
                      checked={bypassGovernance}
                      value={"bypass_governance"}
                      id="bypass_governance"
                      name="bypass_governance"
                      onChange={(e) => {
                        setBypassGovernance(!bypassGovernance);
                      }}
                      helper=""
                    />
                  </div>
                </Fragment>
              )}
              {deleteVersions && (
                <Fragment>
                  <NotificationAlert title={"Warning, this action is irreversible"} variant={"danger"}>
                    This will remove the {selectedObjects.length === 1 ? "object" : "objects"} as well as all of its
                    versions.
                  </NotificationAlert>
                </Fragment>
              )}
            </Fragment>
          )}
        </Fragment>
      }
    />
  );
};

export default DeleteMultipleObjects;
