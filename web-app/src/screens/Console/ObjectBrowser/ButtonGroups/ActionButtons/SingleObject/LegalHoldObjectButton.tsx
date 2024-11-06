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
import SetLegalHoldModal from "../../../../Buckets/ListBuckets/Objects/ObjectDetails/SetLegalHoldModal";
import { AppState, useAppDispatch } from "../../../../../../store";
import { selDistSet } from "../../../../../../systemSlice";

const LegalHoldObjectButton = () => {
  const params = useParams();
  const dispatch = useAppDispatch();

  const [legalHoldOpen, setLegalHoldOpen] = useState<boolean>(false);

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

  const distributedSetup = useSelector(selDistSet);

  if (!actualInfo) {
    return null;
  }

  const canSetLegalHold = hasPermission(bucketName, [
    IAM_SCOPES.S3_PUT_OBJECT_LEGAL_HOLD,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ]);

  const closeLegalholdModal = (reload: boolean) => {
    setLegalHoldOpen(false);
    if (reload) {
      dispatch(setLoadingObjectInfo(true));
    }
  };

  return (
    <Fragment>
      {legalHoldOpen && actualInfo && (
        <SetLegalHoldModal
          open={legalHoldOpen}
          closeModalAndRefresh={closeLegalholdModal}
          objectName={actualInfo.name || ""}
          bucketName={bucketName}
          actualInfo={actualInfo}
        />
      )}
      <Tooltip
        tooltip={
          canSetLegalHold
            ? lockingEnabled
              ? "Change Legal Hold rules for this File"
              : "Object Locking must be enabled on this bucket in order to set Legal Hold"
            : permissionTooltipHelper(
              [
                IAM_SCOPES.S3_PUT_OBJECT_LEGAL_HOLD,
                IAM_SCOPES.S3_PUT_ACTIONS,
              ],
              "change legal hold settings for this object",
            )
        }
      >
        <Button
          id={`preview-file`}
          icon={<FeatherIcon />}
          disabled={
            !lockingEnabled ||
            !distributedSetup ||
            !!actualInfo.is_delete_marker ||
            !canSetLegalHold ||
            selectedVersion !== ""
          }
          onClick={() => {
            setLegalHoldOpen(true);
          }}
        >
          Legal Hold
        </Button>
      </Tooltip>
    </Fragment>
  );
};

export default LegalHoldObjectButton;