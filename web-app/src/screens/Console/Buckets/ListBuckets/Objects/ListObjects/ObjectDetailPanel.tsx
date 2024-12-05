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

import React, { Fragment, useEffect, useState } from "react";
import get from "lodash/get";
import { useSelector } from "react-redux";
import { Box, DataIcon, Loader, ScreenTitle } from "mds";
import { api } from "api";
import { BucketObject } from "api/consoleApi";
import {
  niceBytes,
  niceBytesInt,
  niceDaysInt,
} from "../../../../../../common/utils";
import { IAM_SCOPES } from "../../../../../../common/SecureComponent/permissions";
import { AppState, useAppDispatch } from "../../../../../../store";
import {
  SecureComponent,
} from "../../../../../../common/SecureComponent";
import { selDistSet } from "../../../../../../systemSlice";
import {
  setLoadingObjectInfo,
  setLongFileOpen,
  setObjectInfo,
  setObjectMetadata,
} from "../../../../ObjectBrowser/objectBrowserSlice";
import ObjectMetaData from "../ObjectDetails/ObjectMetaData";
import RenameLongFileName from "../../../../ObjectBrowser/RenameLongFilename";
import { displayFileIconName } from "./utils";
import SingleObjectSelected from "../../../../ObjectBrowser/ButtonGroups/SingleObjectSelected";
import { Theme } from "@emotion/react";
import ObjectDetailsTabs from "./ObjectDetailsTabs";

const emptyFile: BucketObject = {
  is_latest: true,
  last_modified: "",
  legal_hold_status: "",
  name: "",
  retention_mode: "",
  retention_until_date: "",
  size: 0,
  tags: {},
  version_id: undefined,
};

interface IObjectDetailPanelProps {
  internalPaths: string;
  bucketName: string;
}

const ObjectDetailPanel = ({
  internalPaths,
  bucketName,
}: IObjectDetailPanelProps) => {
  const dispatch = useAppDispatch();

  const distributedSetup = useSelector(selDistSet);
  const selectedVersion = useSelector(
    (state: AppState) => state.objectBrowser.selectedVersion
  );
  const loadingObjectInfo = useSelector(
    (state: AppState) => state.objectBrowser.loadingObjectInfo
  );
  const actualInfo = useSelector(
    (state: AppState) => state.objectBrowser.objectData.selectedObjectInfo
  );
  const longFileOpen = useSelector(
    (state: AppState) => state.objectBrowser.longFileOpen
  );

  const [allInfoElements, setAllInfoElements] = useState<BucketObject[]>([]);
  const [versions, setVersions] = useState<BucketObject[]>([]);
  const [totalVersionsSize, setTotalVersionsSize] = useState<number>(0);
  const [loadMetadata, setLoadingMetadata] = useState<boolean>(false);

  const internalPathsDecoded = internalPaths || "";
  const allPathData = internalPathsDecoded.split("/");
  const currentItem = allPathData.pop() || "";

  // calculate object name to display
  let objectNameArray: string[] = [];
  if (actualInfo && actualInfo.name) {
    objectNameArray = actualInfo.name.split("/");
  }

  useEffect(() => {
    if (distributedSetup && allInfoElements && allInfoElements.length >= 1) {
      let infoElement =
        allInfoElements.find((el: BucketObject) => el.is_latest) || emptyFile;

      if (selectedVersion !== "") {
        infoElement =
          allInfoElements.find(
            (el: BucketObject) => el.version_id === selectedVersion
          ) || emptyFile;
      }

      if (!infoElement.is_delete_marker) {
        setLoadingMetadata(true);
      }

      dispatch(setObjectInfo(infoElement));
    }
  }, [selectedVersion, distributedSetup, allInfoElements, dispatch]);

  useEffect(() => {
    if (loadingObjectInfo && internalPaths !== "") {
      api.buckets
        .listObjects(bucketName, {
          prefix: internalPaths,
          with_versions: distributedSetup,
        })
        .then((res) => {
          const result: BucketObject[] = res.data.objects || [];
          if (distributedSetup) {
            setAllInfoElements(result);
            setVersions(result);

            const tVersionSize = result.reduce(
              (acc: number, currValue: BucketObject): number => {
                if (currValue?.size) {
                  return acc + currValue.size;
                }
                return acc;
              },
              0
            );

            setTotalVersionsSize(tVersionSize);
          } else {
            const resInfo = result[0];

            dispatch(setObjectInfo(resInfo));
            setVersions([]);

            if (!resInfo.is_delete_marker) {
              setLoadingMetadata(true);
            }
          }

          dispatch(setLoadingObjectInfo(false));
        })
        .catch((err) => {
          console.error("Error loading object details", err.error);
          dispatch(setLoadingObjectInfo(false));
        });
    }
  }, [
    loadingObjectInfo,
    bucketName,
    internalPaths,
    dispatch,
    distributedSetup,
    selectedVersion,
  ]);

  useEffect(() => {
    if (loadMetadata && internalPaths !== "") {
      api.buckets
        .getObjectMetadata(bucketName, {
          prefix: internalPaths,
          versionID: actualInfo?.version_id || "",
        })
        .then((res) => {
          let metadata = get(res.data, "objectMetadata", {});

          dispatch(setObjectMetadata(metadata));
          setLoadingMetadata(false);
        })
        .catch((err) => {
          console.error("Error Getting Metadata Status: ", err.detailedError);
          setLoadingMetadata(false);
        });
    }
  }, [
    bucketName,
    internalPaths,
    loadMetadata,
    actualInfo?.version_id,
    dispatch,
  ]);

  const closeFileOpen = () => {
    dispatch(setLongFileOpen(false));
  };

  const loaderForContainer = (
    <div style={{ textAlign: "center", marginTop: 35 }}>
      <Loader />
    </div>
  );

  if (!actualInfo) {
    if (loadingObjectInfo) {
      return loaderForContainer;
    }

    return null;
  }

  const objectName =
    objectNameArray.length > 0
      ? objectNameArray[objectNameArray.length - 1]
      : actualInfo.name;

  const calculateLastModifyTime = (lastModified: string) => {
    const currentTime = new Date();
    const modifiedTime = new Date(lastModified);

    const difTime = currentTime.getTime() - modifiedTime.getTime();

    const formatTime = niceDaysInt(difTime, "ms");

    return formatTime.trim() !== "" ? `${formatTime} ago` : "Just now";
  };

  return (
    <Fragment>
      {longFileOpen && actualInfo && (
        <RenameLongFileName
          open={longFileOpen}
          closeModal={closeFileOpen}
          currentItem={currentItem}
          bucketName={bucketName}
          internalPaths={internalPaths}
          actualInfo={actualInfo}
        />
      )}

      {loadingObjectInfo ? (
        <Fragment>{loaderForContainer}</Fragment>
      ) : (
        <Box
          sx={(theme) => ({
            backgroundColor: theme.colors["Color/Neutral/Bg/colorBgShell"],
            padding: `${theme.paddingSizes["sizeLG"]}px ${theme.paddingSizes["size"]}px`,
            borderRadius: theme.borderRadius["borderRadiusLG"],
            height: "100%",
            "& .ObjectDetailsTitle": {
              display: "flex",
              alignItems: "center",
              "& .min-icon": {
                width: 26,
                height: 26,
                minWidth: 26,
                minHeight: 26,
              },
            },
            "& .objectNameContainer": {
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              alignItems: "center",
              marginLeft: 10,
            },
            "& .capitalizeFirst": {
              textTransform: "capitalize",
            },
          })}
        >
          <Box
            sx={(theme) => ({
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: theme.paddingSizes["size"],
              "& .objTitleName": {
                overflowWrap: "break-word",
                boxSizing: "border-box",
                overflow: "hidden",
                color: theme.colors["Color/Neutral/Text/colorTextHeading"],
              },
            })}
          >
            {displayFileIconName(objectName || "", true)}
            <Box className={"objTitleName Base_Strong"}>{objectName}</Box>
          </Box>
          <SingleObjectSelected />
          <ObjectDetailsTabs
            totalVersionsSize={totalVersionsSize}
            versions={versions}
          />
        </Box>
      )}
    </Fragment>
  );
};

export default ObjectDetailPanel;
