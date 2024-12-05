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

import React, { Fragment, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CopyToClipboard from "react-copy-to-clipboard";

import { Link, useNavigate } from "react-router-dom";
import { safeDecodeURIComponent } from "../../../common/utils";
import {
  Button,
  CopyIcon,
  FolderPlusIcon,
  Tooltip,
  Breadcrumbs,
  breakPoints,
  Box,
  styled, ExpandMenu, EllipsisVerticalIcon, ExpandMenuOption, EyeOffIcon, EyeIcon, BreadcrumbsOption
} from "mds";
import { hasPermission, SecureComponent } from "../../../common/SecureComponent";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../common/SecureComponent/permissions";
import {
  resetMessages,
  setShowDeletedObjects,
  setVersionsModeEnabled,
} from "./objectBrowserSlice";
import withSuspense from "../Common/Components/withSuspense";
import { setSnackBarMessage } from "../../../systemSlice";
import { AppState, useAppDispatch } from "../../../store";
import { getSessionGrantsWildCard } from "../Buckets/ListBuckets/UploadPermissionUtils";
import SearchBox from "../Common/SearchBox";
import FilterObjectsSB from "./FilterObjectsSB";
import { SelectorTypes } from "../../../common/types";
import { isVersionedMode } from "../../../utils/validationFunctions";

const CreatePathModal = withSuspense(
  React.lazy(
    () => import("../Buckets/ListBuckets/Objects/ListObjects/CreatePathModal"),
  ),
);

const BreadcrumbsMain = styled.div(() => ({
  boxSizing: "content-box" as const,
  display: "grid",
  gridTemplateColumns: "1fr 230px auto auto",
  alignItems: "center",
  gap: 8,
  "& .slashSpacingStyle": {
    margin: "0 5px",
  },
}));

interface IObjectBrowser {
  bucketName: string;
  internalPaths: string;
  hidePathButton?: boolean;
  additionalOptions?: SelectorTypes[];
  uploadButton: ReactNode;
}

const BrowserBreadcrumbs = ({
  bucketName,
  internalPaths,
  hidePathButton,
  additionalOptions,
                              uploadButton,
}: IObjectBrowser) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const rewindEnabled = useSelector(
    (state: AppState) => state.objectBrowser.rewind.rewindEnabled,
  );
  const versionsMode = useSelector(
    (state: AppState) => state.objectBrowser.versionsMode,
  );
  const anonymousMode = useSelector(
    (state: AppState) => state.system.anonymousMode,
  );
  const showDeleted = useSelector(
    (state: AppState) => state.objectBrowser.showDeleted,
  );
  const versioningConfig = useSelector(
    (state: AppState) => state.objectBrowser.versionInfo,
  );

  const isVersioningApplied = isVersionedMode(versioningConfig.status);

  const [createFolderOpen, setCreateFolderOpen] = useState<boolean>(false);
  const [canCreateSubpath, setCanCreateSubpath] = useState<boolean>(false);

  const putObjectPermScopes = [
    IAM_SCOPES.S3_PUT_OBJECT,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ];

  const sessionGrants = useSelector((state: AppState) =>
    state.console.session ? state.console.session.permissions || {} : {},
  );

  let paths = internalPaths;

  if (internalPaths !== "") {
    paths = `/${internalPaths}`;
  }

  const splitPaths = paths.split("/").filter((path) => path !== "");
  const lastBreadcrumbsIndex = splitPaths.length - 1;

  const pathToCheckPerms = bucketName + paths || bucketName;
  const sessionGrantWildCards = getSessionGrantsWildCard(
    sessionGrants,
    pathToCheckPerms,
    putObjectPermScopes,
  );

  useEffect(() => {
    setCanCreateSubpath(false);
    Object.keys(sessionGrants).forEach((grant) => {
      grant.includes(pathToCheckPerms) &&
        grant.includes("/*") &&
        setCanCreateSubpath(true);
    });
  }, [pathToCheckPerms, internalPaths, sessionGrants]);

  const canCreatePath =
    hasPermission(
      [pathToCheckPerms, ...sessionGrantWildCards],
      putObjectPermScopes,
    ) ||
    anonymousMode ||
    canCreateSubpath;

  let breadcrumbsMap: BreadcrumbsOption[] = splitPaths.map(
    (objectItem: string, index: number) => {
      const subSplit = `${splitPaths.slice(0, index + 1).join("/")}/`;
      const route = `../${bucketName}/${
        subSplit ? `${encodeURIComponent(subSplit)}` : `../`
      }`;

      return {
        to: route,
        label: safeDecodeURIComponent(objectItem),
      };
    },
  );

  const listBreadcrumbs: BreadcrumbsOption[] = [
    {
      to: `../${bucketName}`,
      label: bucketName,
      onClick: () => {
        dispatch(setVersionsModeEnabled({ status: false, objectName: "" }));
      },
    },
    ...breadcrumbsMap,
  ];

  const closeAddFolderModal = () => {
    setCreateFolderOpen(false);
  };

  const goBackFunction = () => {
    if (versionsMode) {
      dispatch(setVersionsModeEnabled({ status: false, objectName: "" }));
    } else {
      if (splitPaths.length === 0) {
        navigate("/browser");

        return;
      }

      const prevPath = splitPaths.slice(0, -1);

      navigate(
        `/browser/${bucketName}${
          prevPath.length > 0
            ? `/${encodeURIComponent(`${prevPath.join("/")}/`)}`
            : ""
        }`,
      );
    }
  };

  const setDeletedAction = () => {
    dispatch(resetMessages());
    dispatch(setShowDeletedObjects(!showDeleted));
  };

  return (
    <Fragment>
      {createFolderOpen && (
        <CreatePathModal
          modalOpen={createFolderOpen}
          bucketName={bucketName}
          folderName={internalPaths}
          onClose={closeAddFolderModal}
          limitedSubPath={
            canCreateSubpath &&
            !(
              hasPermission(
                [pathToCheckPerms, ...sessionGrantWildCards],
                putObjectPermScopes,
              ) || anonymousMode
            )
          }
        />
      )}
      <BreadcrumbsMain>
        <Breadcrumbs
          options={listBreadcrumbs}
          goBackFunction={goBackFunction}
          markCurrentItem={versionsMode}
          displayLastItems={2}
          onClickOption={(to) => {
            navigate(to || "/");
            dispatch(setVersionsModeEnabled({ status: false, objectName: "" }));
          }}
        />
        <SecureComponent
          scopes={[IAM_SCOPES.S3_LIST_BUCKET, IAM_SCOPES.S3_ALL_LIST_BUCKET]}
          resource={bucketName}
          errorProps={{ disabled: true }}
        >
          <FilterObjectsSB />
        </SecureComponent>
        {uploadButton}
        <Box>
          <ExpandMenu
            id={"list-options"}
            icon={<EllipsisVerticalIcon />}
            compact
            sx={{ padding: 6, width: 28, height: 28, boxSizing: "border-box" }}
            dropMenuPosition={"end"}
            dropArrow={false}
          >
            {!hidePathButton && (
              <Tooltip
                tooltip={
                  canCreatePath
                    ? ""
                    : permissionTooltipHelper(
                        [IAM_SCOPES.S3_PUT_OBJECT, IAM_SCOPES.S3_PUT_ACTIONS],
                        "create a new path"
                      )
                }
              >
                <Button
                  id={"new-path"}
                  onClick={() => {
                    setCreateFolderOpen(true);
                  }}
                  disabled={
                    anonymousMode ? false : rewindEnabled || !canCreatePath
                  }
                  icon={<FolderPlusIcon />}
                  style={{
                    whiteSpace: "nowrap",
                  }}
                  label={"Create new path"}
                />
              </Tooltip>
            )}
            <CopyToClipboard text={`${bucketName}/${splitPaths.join("/")}`}>
              <Button
                id={"copy-path"}
                icon={<CopyIcon />}
                onClick={() => {
                  // TODO: ENABLE NOTIFICATIONS
                  //notification.success("Path copied to clipboard");
                }}
                label={"Copy Path"}
              />
            </CopyToClipboard>

              <ExpandMenuOption
                id={"deleted-objects-toggle"}
                icon={showDeleted ? <EyeOffIcon /> : <EyeIcon />}
                onClick={setDeletedAction}
                disabled={!isVersioningApplied || rewindEnabled}
              >
                {showDeleted ? "Hide" : "Show"} Deleted Objects
              </ExpandMenuOption>
          </ExpandMenu>
        </Box>
      </BreadcrumbsMain>
    </Fragment>
  );
};

export default BrowserBreadcrumbs;
