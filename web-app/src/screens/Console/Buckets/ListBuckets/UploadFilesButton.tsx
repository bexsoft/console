// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
import { ExpandMenu, ExpandMenuOption, FolderUpIcon, UploadIcon } from "mds";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../common/SecureComponent/permissions";
import { hasPermission } from "../../../../common/SecureComponent";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";
import { useSelector } from "react-redux";
import { AppState } from "../../../../store";
import { getSessionGrantsWildCard } from "./UploadPermissionUtils";

interface IUploadFilesButton {
  uploadPath: string;
  bucketName: string;
  forceDisable?: boolean;
  uploadFileFunction: () => void;
  uploadFolderFunction: () => void;
}

const UploadFilesButton = ({
  uploadPath,
  bucketName,
  forceDisable = false,
  uploadFileFunction,
  uploadFolderFunction,
}: IUploadFilesButton) => {

  const anonymousMode = useSelector(
    (state: AppState) => state.system.anonymousMode,
  );

  const sessionGrants = useSelector((state: AppState) =>
    state.console.session ? state.console.session.permissions || {} : {},
  );

  const putObjectPermScopes = [
    IAM_SCOPES.S3_PUT_OBJECT,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ];

  const sessionGrantWildCards = getSessionGrantsWildCard(
    sessionGrants,
    uploadPath,
    putObjectPermScopes,
  );

  const uploadObjectAllowed =
    hasPermission(
      [uploadPath, ...sessionGrantWildCards],
      putObjectPermScopes,
    ) || anonymousMode;

  const uploadFolderAllowed = hasPermission(
    [bucketName, ...sessionGrantWildCards],
    putObjectPermScopes,
    false,
    true,
  );

  const uploadFilesAction = (action: string) => {
    if (action === "folder") {
      uploadFolderFunction();
      return;
    }

    uploadFileFunction();
  };

  const uploadEnabled: boolean = uploadObjectAllowed || uploadFolderAllowed;

  return (
    <Fragment>
      <TooltipWrapper
        tooltip={
          uploadEnabled
            ? ""
            : permissionTooltipHelper(
                [IAM_SCOPES.S3_PUT_OBJECT, IAM_SCOPES.S3_PUT_ACTIONS],
                "upload files to this bucket",
              )
        }
      >
        <ExpandMenu
          id={"upload-main"}
          aria-controls={`upload-main-menu`}
          aria-haspopup="true"
          label={"Upload"}
          variant={"primary"}
          icon={<UploadIcon />}
          disabled={forceDisable || !uploadEnabled}
          dropMenuPosition={"end"}
          compact
          menuTopSpacing={false}
        >
          <ExpandMenuOption
            onClick={() => uploadFilesAction("file")}
            id={"upload-file"}
            icon={<UploadIcon />}
            disabled={!uploadObjectAllowed || forceDisable}
          >
            Upload File
          </ExpandMenuOption>
          <ExpandMenuOption
            onClick={() => uploadFilesAction("folder")}
            id={"upload-folder"}
            icon={<FolderUpIcon />}
            disabled={!uploadFolderAllowed || forceDisable}
          >
            Upload Folder
          </ExpandMenuOption>
        </ExpandMenu>
      </TooltipWrapper>
    </Fragment>
  );
};

export default UploadFilesButton;
