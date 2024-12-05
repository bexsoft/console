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

import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Badge, Box, Button, PlusIcon, Tabs, Tag, useMDSTheme } from "mds";
import { AppState, useAppDispatch } from "../../../../../../store";
import { selDistSet, setModalErrorSnackMessage } from "../../../../../../systemSlice";
import { IAM_SCOPES } from "../../../../../../common/SecureComponent/permissions";
import {
  setLoadingObjectInfo,
  setSelectedTab,
} from "../../../../ObjectBrowser/objectBrowserSlice";
import ConfirmDialog from "../../../../Common/ModalWrapper/ConfirmDialog";
import TagsModal from "../ObjectDetails/TagsModal";
import {
  calculateLastModifyTime,
  niceBytes,
  niceBytesInt,
} from "../../../../../../common/utils";
import {
  hasPermission,
  SecureComponent,
} from "../../../../../../common/SecureComponent";
import ObjectMetaData from "../ObjectDetails/ObjectMetaData";
import get from "lodash/get";
import { BucketObject } from "../../../../../../api/consoleApi";
import { api } from "../../../../../../api";
import { errorToHandler } from "../../../../../../api/errors";

interface IObjectDetailsTabs {
  versions?: BucketObject[];
  selectedObjectInfo?: BucketObject;
  totalVersionsSize?: number;
  disableAddTags?: boolean;
}

const ObjectDetailsTabs = ({
  versions,
  totalVersionsSize,
  selectedObjectInfo,
  disableAddTags = false,
}: IObjectDetailsTabs) => {
  const theme = useMDSTheme();
  const dispatch = useAppDispatch();
  const distributedSetup = useSelector(selDistSet);
  const { bucketName } = useParams();
  const mainObjectInfo = useSelector(
    (state: AppState) => state.objectBrowser.objectData.selectedObjectInfo
  );
  const selectedVersion = useSelector(
    (state: AppState) => state.objectBrowser.selectedVersion
  );
  const detailsSection = useSelector(
    (state: AppState) => state.objectBrowser.selectedTab
  );

  const [deleteEnabled, setDeleteEnabled] = useState<boolean>(false);
  const [tagModalOpen, setTagModalOpen] = useState<boolean>(false);
  const [deleteKey, setDeleteKey] = useState<string>("");
  const [deleteLabel, setDeleteLabel] = useState<string>("");

  const actualInfo = selectedObjectInfo ? selectedObjectInfo : mainObjectInfo;

  // calculate object name to display
  let objectNameArray: string[] = [];
  if (actualInfo && actualInfo.name) {
    objectNameArray = actualInfo.name.split("/");
  }

  if (!actualInfo) {
    return null;
  }

  const objectName =
    objectNameArray.length > 0
      ? objectNameArray[objectNameArray.length - 1]
      : actualInfo.name;

  let tagKeys: string[] = [];
  const currentTags = actualInfo.tags;

  if (actualInfo && actualInfo.tags) {
    tagKeys = Object.keys(actualInfo.tags);
  }

  const objectResources = [
    bucketName!,
    objectName!,
    [bucketName, actualInfo.name].join("/"),
  ];

  const canGetTags = hasPermission(objectResources, [
    IAM_SCOPES.S3_GET_OBJECT_TAGGING,
    IAM_SCOPES.S3_GET_ACTIONS,
  ]);

  const onDeleteTag = (tagKey: string, tag: string) => {
    setDeleteKey(tagKey);
    setDeleteLabel(tag);
    setDeleteEnabled(true);
  };

  const cancelDelete = () => {
    setDeleteKey("");
    setDeleteLabel("");
    setDeleteEnabled(false);
  };

  const closeAddTagModal = (reloadObjectData: boolean) => {
    setTagModalOpen(false);
    if (reloadObjectData) {
      dispatch(setLoadingObjectInfo(true));
    }
  };

  const deleteTagProcess = async () => {
    const cleanObject: any = { ...currentTags };
    delete cleanObject[deleteKey];

    const verID = distributedSetup ? actualInfo.version_id || "" : "null";

    api.buckets
      .putObjectTags(
        bucketName!,
        { prefix: actualInfo.name || "", version_id: verID },
        { tags: cleanObject },
      )
      .then(() => {
        setDeleteEnabled(false);
        dispatch(setLoadingObjectInfo(true));
      })
      .catch((err) => {
        //TODO: Fix error display
        //dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
        //setIsSending(false);
      });
  };

  return (
    <Box
      sx={{
        color: theme.colors["Color/Neutral/Text/colorTextHeading"],
        "& .capitalizeFirst": {
          textTransform: "capitalize",
        },
        "& .detailContainer": {
          boxSizing: "border-box",
          overflowWrap: "break-word",
        },
      }}
    >
      {deleteEnabled && (
        <ConfirmDialog
          onClose={cancelDelete}
          onConfirm={deleteTagProcess}
          title={"Confirm deletion"}
          confirmationContent={`Are you sure you want to delete the tag ${deleteKey} : ${deleteLabel}`}
          confirmText={"Confirm"}
          isOpen={deleteEnabled}
        />
      )}

      {tagModalOpen && actualInfo && (
        <TagsModal
          modalOpen={tagModalOpen}
          bucketName={bucketName!}
          actualInfo={actualInfo}
          onCloseAndUpdate={closeAddTagModal}
        />
      )}

      <Tabs
        options={[
          {
            tabConfig: { label: "Details", id: "information" },
            content: (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  "& .labelTitle": {
                    color: theme.colors["Color/Neutral/Text/colorTextLabel"],
                  },
                }}
              >
                <Box className={"detailContainer "}>
                  <div className={"labelTitle SM_Normal"}>Name</div>
                  <div
                    className={"SM_Strong"}
                    style={{ overflowWrap: "break-word" }}
                  >
                    {objectName}
                  </div>
                </Box>
                {selectedVersion !== "" && (
                  <Box className={"detailContainer"}>
                    <div className={"labelTitle SM_Normal"}>Version ID</div>
                    <div className={"SM_Strong"}>{selectedVersion}</div>
                  </Box>
                )}
                <Box className={"detailContainer"}>
                  <div className={"labelTitle SM_Normal"}>Size</div>
                  <div className={"SM_Strong"}>
                    {niceBytes(`${actualInfo.size || "0"}`)}
                  </div>
                </Box>
                {versions &&
                  totalVersionsSize &&
                  actualInfo.version_id &&
                  actualInfo.version_id !== "null" &&
                  selectedVersion === "" && (
                    <Box className={"detailContainer"}>
                      <div className={"labelTitle SM_Normal"}>Versions:</div>
                      <div className={"SM_Strong"}>
                        {versions.length} version
                        {versions.length !== 1 ? "s" : ""},{" "}
                        {niceBytesInt(totalVersionsSize)}
                      </div>
                    </Box>
                  )}
                {selectedVersion === "" && (
                  <Box className={"detailContainer"}>
                    <div className={"labelTitle SM_Normal"}>Last Modified:</div>
                    <div className={"SM_Strong"}>
                      {calculateLastModifyTime(actualInfo.last_modified || "")}
                    </div>
                  </Box>
                )}
                <Box className={"detailContainer"}>
                  <div className={"labelTitle SM_Normal"}>ETAG:</div>
                  <div className={"SM_Strong"}>{actualInfo.etag || "N/A"}</div>
                </Box>
                <Box className={"detailContainer"}>
                  <SecureComponent
                    scopes={[
                      IAM_SCOPES.S3_GET_OBJECT_LEGAL_HOLD,
                      IAM_SCOPES.S3_GET_ACTIONS,
                    ]}
                    resource={bucketName!}
                  >
                    <Fragment>
                      <div className={"labelTitle SM_Normal"}>Legal Hold:</div>
                      <div className={"SM_Strong"}>
                        {actualInfo.legal_hold_status ? "On" : "Off"}
                      </div>
                    </Fragment>
                  </SecureComponent>
                </Box>
                <Box className={"detailContainer"}>
                  <SecureComponent
                    scopes={[
                      IAM_SCOPES.S3_GET_OBJECT_RETENTION,
                      IAM_SCOPES.S3_GET_ACTIONS,
                    ]}
                    resource={bucketName!}
                  >
                    <Fragment>
                      <div className={"labelTitle SM_Normal"}>
                        Retention Policy:
                      </div>
                      <div className={"SM_Strong capitalizeFirst"}>
                        {actualInfo.version_id &&
                        actualInfo.version_id !== "null" ? (
                          <Fragment>
                            {actualInfo.retention_mode
                              ? actualInfo.retention_mode.toLowerCase()
                              : "None"}
                          </Fragment>
                        ) : (
                          <Fragment>
                            {actualInfo.retention_mode
                              ? actualInfo.retention_mode.toLowerCase()
                              : "None"}
                          </Fragment>
                        )}
                      </div>
                    </Fragment>
                  </SecureComponent>
                </Box>
              </Box>
            ),
          },
          {
            tabConfig: {
              label: "Tags",
              id: "tags",
              disabled:
                !!actualInfo.is_delete_marker ||
                selectedVersion !== "" ||
                !canGetTags,
            },
            content: (
              <Box>
                <SecureComponent
                  scopes={[
                    IAM_SCOPES.S3_GET_OBJECT_TAGGING,
                    IAM_SCOPES.S3_GET_ACTIONS,
                  ]}
                  resource={bucketName!}
                >
                  {!disableAddTags && (
                    <Button
                      icon={<PlusIcon />}
                      id="addtag"
                      onClick={() => setTagModalOpen(true)}
                      label="Add Tag"
                      variant="primary-lighter"
                      sx={{ width: "100%" }}
                      compact
                    />
                  )}
                  <Box sx={{ marginTop: "12px", marginBottom: "15px" }}>
                    {tagKeys.map((tagKey: string, index: number) => {
                      const tag = get(currentTags, `${tagKey}`, "");
                      if (tag !== "") {
                        if (disableAddTags) {
                          return (
                            <Badge
                              key={`chip-${index}`}
                              id={`${tagKey} : ${tag}`}
                              label={`${tagKey} : ${tag}`}
                              color={"info"}
                              size={"small"}
                            />
                          );
                        }
                        return (
                          <SecureComponent
                            key={`chip-${index}`}
                            scopes={[IAM_SCOPES.S3_DELETE_OBJECT_TAGGING]}
                            resource={bucketName!}
                            errorProps={{
                              deleteIcon: null,
                              onDelete: null,
                            }}
                          >
                            <Tag
                              id={`${tagKey} : ${tag}`}
                              label={`${tagKey} : ${tag}`}
                              color={"primary"}
                              sx={{ marginRight: 5, marginBottom: 5 }}
                              onDelete={() => {
                                onDeleteTag(tagKey, tag);
                              }}
                              size={"small"}
                            />
                          </SecureComponent>
                        );
                      }
                      return null;
                    })}
                  </Box>
                </SecureComponent>
              </Box>
            ),
          },
          {
            tabConfig: {
              label: "Metadata",
              id: "metadata",
              disabled: actualInfo.is_delete_marker,
            },
            content: !actualInfo.is_delete_marker ? (
              <Fragment>
                <Box
                  className={"detailContainer SM_Normal"}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {actualInfo ? <ObjectMetaData /> : null}
                </Box>
              </Fragment>
            ) : (
              <Fragment />
            ),
          },
        ]}
        onTabClick={(newSection) => {
          dispatch(setSelectedTab(newSection));
        }}
        currentTabOrPath={detailsSection}
        horizontal
        sx={{
          marginTop: theme.paddingSizes["size"],
          backgroundColor: "transparent",
          "& .tabsPanels": {
            padding: "16px 0",
          },
          "& .optionsContainer": {
            backgroundColor: "transparent",
          },
        }}
      />
    </Box>
  );
};

export default ObjectDetailsTabs;
