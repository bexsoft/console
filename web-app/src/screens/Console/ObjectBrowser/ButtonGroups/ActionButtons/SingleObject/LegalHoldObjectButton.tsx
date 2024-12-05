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
import { Button, ScaleIcon, Tooltip } from "mds";
import { useSelector } from "react-redux";
import { hasPermission } from "../../../../../../common/SecureComponent";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../../common/SecureComponent/permissions";
import { useParams } from "react-router-dom";
import { setLegalHoldOpen } from "../../../objectBrowserSlice";
import { AppState, useAppDispatch } from "../../../../../../store";
import { selDistSet } from "../../../../../../systemSlice";

const LegalHoldObjectButton = () => {
  const params = useParams();
  const dispatch = useAppDispatch();

  const bucketName = params.bucketName || "";

  const actualInfo = useSelector(
    (state: AppState) => state.objectBrowser.objectData.selectedObjectInfo
  );
  const selectedVersion = useSelector(
    (state: AppState) => state.objectBrowser.selectedVersion
  );
  const lockingEnabled = useSelector(
    (state: AppState) => state.objectBrowser.lockingEnabled
  );

  const distributedSetup = useSelector(selDistSet);

  if (!actualInfo) {
    return null;
  }

  const canSetLegalHold = hasPermission(bucketName, [
    IAM_SCOPES.S3_PUT_OBJECT_LEGAL_HOLD,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ]);

  return (
    <Fragment>
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
                "change legal hold settings for this object"
              )
        }
      >
        <Button
          id={`preview-file`}
          icon={<ScaleIcon />}
          disabled={
            !lockingEnabled ||
            !distributedSetup ||
            !!actualInfo.is_delete_marker ||
            !canSetLegalHold ||
            selectedVersion !== ""
          }
          onClick={() => {
            dispatch(setLegalHoldOpen(true));
          }}
        >
          Legal Hold
        </Button>
      </Tooltip>
    </Fragment>
  );
};

export default LegalHoldObjectButton;
