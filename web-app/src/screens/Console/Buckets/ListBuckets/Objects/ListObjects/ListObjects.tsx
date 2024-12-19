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

import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import get from "lodash/get";
import {
  Box,
  BucketIcon,
  Button,
  ButtonGroup,
  ChevronRightIcon,
  NotificationCount,
  RefreshCWIcon,
  RewindIcon,
  ScreenTitle,
  ScreenTitleOptions,
  useMDSTheme,
} from "mds";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { BucketQuota } from "api/consoleApi";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { DateTime } from "luxon";
import { niceBytesInt } from "../../../../../../common/utils";
import BrowserBreadcrumbs from "../../../../ObjectBrowser/BrowserBreadcrumbs";
import { ErrorResponseHandler } from "../../../../../../common/types";
import { AppState, useAppDispatch } from "../../../../../../store";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../../../../common/SecureComponent";
import { setErrorSnackMessage } from "../../../../../../systemSlice";
import { isVersionedMode } from "../../../../../../utils/validationFunctions";
import {
  extractFileExtn,
  getPolicyAllowedFileExtensions,
  getSessionGrantsWildCard,
} from "../../UploadPermissionUtils";
import {
  makeid,
  removeTrace,
  storeCallForObjectWithID,
  storeFormDataWithID,
} from "../../../../ObjectBrowser/transferManager";
import {
  cancelObjectInList,
  completeObject,
  failObject,
  openList,
  resetMessages,
  resetRewind,
  setAnonymousAccessOpen,
  setDownloadRenameModal,
  setLoadingVersions,
  setNewObject,
  setObjectDetailsView,
  setObjectMetadata,
  setPreviewOpen,
  setReloadObjectsList,
  setRetentionConfig,
  setSelectedObjectView,
  setSelectedPreview,
  setShareFileModalOpen,
  setVersionsModeEnabled,
  updateProgress,
} from "../../../../ObjectBrowser/objectBrowserSlice";
import {
  selBucketDetailsInfo,
  selBucketDetailsLoading,
  setBucketDetailsLoad,
  setBucketInfo,
} from "../../../BucketDetails/bucketDetailsSlice";
import withSuspense from "../../../../Common/Components/withSuspense";
import UploadFilesButton from "../../UploadFilesButton";
import DetailsListPanel from "./DetailsListPanel";
import ObjectDetailPanel from "./ObjectDetailPanel";
import VersionsNavigator from "../ObjectDetails/VersionsNavigator";
import RenameLongFileName from "../../../../ObjectBrowser/RenameLongFilename";
import TooltipWrapper from "../../../../Common/TooltipWrapper/TooltipWrapper";
import ListObjectsTable from "./ListObjectsTable";
import FilterObjectsSB from "../../../../ObjectBrowser/FilterObjectsSB";
import AddAccessRule from "../../../BucketDetails/AddAccessRule";
import EPageLayout from "../../../../Common/EPageLayout/EPageLayout";
import MultipleObjectSelection from "../../../../ObjectBrowser/ButtonGroups/MultipleObjectSelection";

const ShareFile = withSuspense(
  React.lazy(() => import("../ObjectDetails/ShareFile"))
);
const RewindEnable = withSuspense(React.lazy(() => import("./RewindEnable")));
const PreviewFileModal = withSuspense(
  React.lazy(() => import("../Preview/PreviewFileModal"))
);

const baseDnDStyle = {
  borderWidth: 3,
  borderRadius: 6,
  borderColor: "transparent",
  outline: "none",
};

const activeDnDStyle = {
  borderStyle: "dashed",
  borderColor: "#2196f3",
  backgroundColor: "#ff0000",
};

const acceptDnDStyle = {
  borderStyle: "dashed",
  //backgroundColor: "transparent",
  borderColor: "#00e676",
};

const ListObjects = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useMDSTheme();

  const rewindEnabled = useSelector(
    (state: AppState) => state.objectBrowser.rewind.rewindEnabled
  );
  const bucketToRewind = useSelector(
    (state: AppState) => state.objectBrowser.rewind.bucketToRewind
  );
  const versionsMode = useSelector(
    (state: AppState) => state.objectBrowser.versionsMode
  );
  const showDeleted = useSelector(
    (state: AppState) => state.objectBrowser.showDeleted
  );
  const detailsOpen = useSelector(
    (state: AppState) => state.objectBrowser.objectDetailsOpen
  );
  const selectedInternalPaths = useSelector(
    (state: AppState) => state.objectBrowser.selectedInternalPaths
  );
  const requestInProgress = useSelector(
    (state: AppState) => state.objectBrowser.requestInProgress
  );
  const simplePath = useSelector(
    (state: AppState) => state.objectBrowser.simplePath
  );
  const versioningConfig = useSelector(
    (state: AppState) => state.objectBrowser.versionInfo
  );
  const downloadRenameModal = useSelector(
    (state: AppState) => state.objectBrowser.downloadRenameModal
  );
  const selectedPreview = useSelector(
    (state: AppState) => state.objectBrowser.selectedPreview
  );
  const shareFileModalOpen = useSelector(
    (state: AppState) => state.objectBrowser.shareFileModalOpen
  );
  const previewOpen = useSelector(
    (state: AppState) => state.objectBrowser.previewOpen
  );
  const selectedBucket = useSelector(
    (state: AppState) => state.objectBrowser.selectedBucket
  );
  const anonymousMode = useSelector(
    (state: AppState) => state.system.anonymousMode
  );
  const anonymousAccessOpen = useSelector(
    (state: AppState) => state.objectBrowser.anonymousAccessOpen
  );

  const records = useSelector(
    (state: AppState) => state.objectBrowser?.records || []
  );

  const loadingBucket = useSelector(selBucketDetailsLoading);
  const bucketInfo = useSelector(selBucketDetailsInfo);

  const [rewindSelect, setRewindSelect] = useState<boolean>(false);
  const [iniLoad, setIniLoad] = useState<boolean>(false);
  const [quota, setQuota] = useState<BucketQuota | null>(null);
  const [isMetaDataLoaded, setIsMetaDataLoaded] = useState(false);
  const [panelHidden, setPanelHidden] = useState<"versions" | "objects">(
    "versions"
  );

  const isVersioningApplied = isVersionedMode(versioningConfig.status);

  const bucketName = params.bucketName || "";
  const pathSegment = location.pathname.split(`/browser/${bucketName}/`);
  const internalPaths =
    pathSegment.length === 2 ? decodeURIComponent(pathSegment[1]) : "";

  const currentPath = internalPaths.split("/").filter((i: string) => i !== "");

  let uploadPath = [bucketName];
  if (currentPath.length > 0) {
    uploadPath = uploadPath.concat(currentPath);
  }

  const fileUpload = useRef<HTMLInputElement>(null);
  const folderUpload = useRef<HTMLInputElement>(null);

  const sessionGrants = useSelector((state: AppState) =>
    state.console.session ? state.console.session.permissions || {} : {}
  );

  const putObjectPermScopes = [
    IAM_SCOPES.S3_PUT_OBJECT,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ];

  const pathAsResourceInPolicy = uploadPath.join("/");
  const allowedFileExtensions = getPolicyAllowedFileExtensions(
    sessionGrants,
    pathAsResourceInPolicy,
    putObjectPermScopes
  );

  const sessionGrantWildCards = getSessionGrantsWildCard(
    sessionGrants,
    pathAsResourceInPolicy,
    putObjectPermScopes
  );

  const canUpload =
    hasPermission(
      [pathAsResourceInPolicy, ...sessionGrantWildCards],
      putObjectPermScopes
    ) || anonymousMode;

  const configureBucketAllowed = hasPermission(bucketName, [
    IAM_SCOPES.S3_GET_BUCKET_POLICY,
    IAM_SCOPES.S3_PUT_BUCKET_POLICY,
    IAM_SCOPES.S3_GET_BUCKET_VERSIONING,
    IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
    IAM_SCOPES.S3_GET_BUCKET_ENCRYPTION_CONFIGURATION,
    IAM_SCOPES.S3_PUT_BUCKET_ENCRYPTION_CONFIGURATION,
    IAM_SCOPES.S3_DELETE_BUCKET,
    IAM_SCOPES.S3_GET_BUCKET_NOTIFICATIONS,
    IAM_SCOPES.S3_PUT_BUCKET_NOTIFICATIONS,
    IAM_SCOPES.S3_GET_REPLICATION_CONFIGURATION,
    IAM_SCOPES.S3_PUT_REPLICATION_CONFIGURATION,
    IAM_SCOPES.ADMIN_GET_BUCKET_QUOTA,
    IAM_SCOPES.ADMIN_SET_BUCKET_QUOTA,
    IAM_SCOPES.S3_PUT_BUCKET_TAGGING,
    IAM_SCOPES.S3_GET_BUCKET_TAGGING,
    IAM_SCOPES.S3_LIST_BUCKET_VERSIONS,
    IAM_SCOPES.S3_GET_BUCKET_POLICY_STATUS,
    IAM_SCOPES.S3_DELETE_BUCKET_POLICY,
    IAM_SCOPES.S3_GET_ACTIONS,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ]);

  const selectedObjects = useSelector(
    (state: AppState) => state.objectBrowser.selectedObjects
  );

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

  const fetchMetadata = useCallback(() => {
    const objectName = selectedObjects[0];

    if (!isMetaDataLoaded && objectName) {
      api.buckets
        .getObjectMetadata(bucketName, {
          prefix: objectName,
        })
        .then((res) => {
          let metadata = get(res.data, "objectMetadata", {});
          setIsMetaDataLoaded(true);
          dispatch(setObjectMetadata(metadata));
        })
        .catch((err) => {
          console.error(
            "Error Getting Metadata Status: ",
            err,
            err?.detailedError
          );
          setIsMetaDataLoaded(true);
        });
    }
  }, [bucketName, selectedObjects, isMetaDataLoaded, dispatch]);

  useEffect(() => {
    if (bucketName && !isSelObjectDelMarker) {
      fetchMetadata();
    }
  }, [bucketName, selectedObjects, fetchMetadata, isSelObjectDelMarker]);

  useEffect(() => {
    if (rewindEnabled) {
      if (bucketToRewind !== bucketName) {
        dispatch(resetRewind());
        return;
      }
    }
  }, [rewindEnabled, bucketToRewind, bucketName, dispatch]);

  useEffect(() => {
    if (folderUpload.current !== null) {
      folderUpload.current.setAttribute("directory", "");
      folderUpload.current.setAttribute("webkitdirectory", "");
    }
  }, [folderUpload]);

  useEffect(() => {
    if (!quota && !anonymousMode) {
      api.buckets
        .getBucketQuota(bucketName)
        .then((res) => {
          let quotaVals = null;

          if (res.data.quota) {
            quotaVals = res.data;
          }

          setQuota(quotaVals);
        })
        .catch((err) => {
          console.error(
            "Error Getting Quota Status: ",
            err.error.detailedMessage
          );
          setQuota(null);
        });
    }
  }, [quota, bucketName, anonymousMode]);

  useEffect(() => {
    if (selectedObjects.length > 0) {
      dispatch(setObjectDetailsView(false));
      return;
    }

    if (
      selectedObjects.length === 0 &&
      selectedInternalPaths === null &&
      !requestInProgress
    ) {
      dispatch(setObjectDetailsView(false));
    }
  }, [selectedObjects, selectedInternalPaths, dispatch, requestInProgress]);

  useEffect(() => {
    if (!iniLoad) {
      dispatch(setBucketDetailsLoad(true));
      setIniLoad(true);
    }
  }, [iniLoad, dispatch, setIniLoad]);

  // bucket info
  useEffect(() => {
    if ((requestInProgress || loadingBucket) && !anonymousMode) {
      api.buckets
        .bucketInfo(bucketName)
        .then((res) => {
          dispatch(setBucketDetailsLoad(false));
          dispatch(setBucketInfo(res.data));
        })
        .catch((err) => {
          dispatch(setBucketDetailsLoad(false));
          dispatch(setErrorSnackMessage(errorToHandler(err)));
        });
    }
  }, [bucketName, loadingBucket, dispatch, anonymousMode, requestInProgress]);

  // Load retention Config

  useEffect(() => {
    if (selectedBucket !== "") {
      api.buckets
        .getBucketRetentionConfig(selectedBucket)
        .then((res) => {
          dispatch(setRetentionConfig(res.data));
        })
        .catch(() => {
          dispatch(setRetentionConfig(null));
        });
    }
  }, [selectedBucket, dispatch]);

  const handleUploadButton = (e: any) => {
    if (
      e === null ||
      e === undefined ||
      e.target.files === null ||
      e.target.files === undefined
    ) {
      return;
    }
    e.preventDefault();
    var newFiles: File[] = [];

    for (let i = 0; i < e.target.files.length; i++) {
      newFiles.push(e.target.files[i]);
    }
    uploadObject(newFiles, "");

    e.target.value = "";
  };

  const uploadObject = useCallback(
    (files: File[], folderPath: string): void => {
      let pathPrefix = "";
      if (simplePath) {
        pathPrefix = simplePath.endsWith("/") ? simplePath : simplePath + "/";
      }

      const upload = (
        files: File[],
        bucketName: string,
        path: string,
        folderPath: string
      ) => {
        let uploadPromise = (file: File) => {
          return new Promise((resolve, reject) => {
            let uploadUrl = `api/v1/buckets/${bucketName}/objects/upload`;
            const fileName = file.name;

            const blobFile = new Blob([file], { type: file.type });

            const filePath = get(file, "path", "");
            const fileWebkitRelativePath = get(file, "webkitRelativePath", "");

            let relativeFolderPath = folderPath;
            const ID = makeid(8);

            // File was uploaded via drag & drop
            if (filePath !== "") {
              relativeFolderPath = filePath;
            } else if (fileWebkitRelativePath !== "") {
              // File was uploaded using upload button
              relativeFolderPath = fileWebkitRelativePath;
            }

            let prefixPath = "";

            if (path !== "" || relativeFolderPath !== "") {
              const finalFolderPath = relativeFolderPath
                .split("/")
                .slice(0, -1)
                .join("/");

              const pathClean = path.endsWith("/") ? path.slice(0, -1) : path;

              prefixPath = `${pathClean}${
                !pathClean.endsWith("/") &&
                finalFolderPath !== "" &&
                !finalFolderPath.startsWith("/")
                  ? "/"
                  : ""
              }${finalFolderPath}${
                !finalFolderPath.endsWith("/") ||
                (finalFolderPath.trim() === "" && !path.endsWith("/"))
                  ? "/"
                  : ""
              }`;
            }

            if (prefixPath !== "") {
              uploadUrl = `${uploadUrl}?prefix=${encodeURIComponent(
                prefixPath + fileName
              )}`;
            } else {
              uploadUrl = `${uploadUrl}?prefix=${encodeURIComponent(fileName)}`;
            }

            const identity = encodeURIComponent(
              `${bucketName}-${prefixPath}-${new Date().getTime()}-${Math.random()}`
            );

            let xhr = new XMLHttpRequest();
            xhr.open("POST", uploadUrl, true);
            if (anonymousMode) {
              xhr.setRequestHeader("X-Anonymous", "1");
            }
            // xhr.setRequestHeader("X-Anonymous", "1");

            const areMultipleFiles = files.length > 1;
            let errorMessage = `An error occurred while uploading the file${
              areMultipleFiles ? "s" : ""
            }.`;

            const errorMessages: any = {
              413: "Error - File size too large",
            };

            xhr.withCredentials = false;
            xhr.onload = function () {
              // resolve promise only when HTTP code is ok
              if (xhr.status >= 200 && xhr.status < 300) {
                dispatch(completeObject(identity));
                resolve({ status: xhr.status });

                removeTrace(ID);
              } else {
                // reject promise if there was a server error
                if (errorMessages[xhr.status]) {
                  errorMessage = errorMessages[xhr.status];
                } else if (xhr.response) {
                  try {
                    const err = JSON.parse(xhr.response);
                    errorMessage = err.detailedMessage;
                  } catch (e) {
                    errorMessage = "something went wrong";
                  }
                }

                dispatch(
                  failObject({
                    instanceID: identity,
                    msg: errorMessage,
                  })
                );
                reject({ status: xhr.status, message: errorMessage });

                removeTrace(ID);
              }
            };

            xhr.upload.addEventListener("error", () => {
              reject(errorMessage);
              dispatch(
                failObject({
                  instanceID: identity,
                  msg: "A network error occurred.",
                })
              );
              return;
            });

            xhr.upload.addEventListener("progress", (event) => {
              const progress = Math.floor((event.loaded * 100) / event.total);

              dispatch(
                updateProgress({
                  instanceID: identity,
                  progress: progress,
                })
              );
            });

            xhr.onerror = () => {
              reject(errorMessage);
              dispatch(
                failObject({
                  instanceID: identity,
                  msg: "A network error occurred.",
                })
              );
              return;
            };
            xhr.onloadend = () => {
              if (files.length === 0) {
                dispatch(setReloadObjectsList(true));
              }
            };
            xhr.onabort = () => {
              dispatch(cancelObjectInList(identity));
            };

            const formData = new FormData();
            if (file.size !== undefined) {
              formData.append(file.size.toString(), blobFile, fileName);
              storeCallForObjectWithID(ID, xhr);
              dispatch(
                setNewObject({
                  ID,
                  bucketName,
                  done: false,
                  instanceID: identity,
                  percentage: 0,
                  prefix: `${prefixPath}${fileName}`,
                  type: "upload",
                  waitingForFile: false,
                  failed: false,
                  cancelled: false,
                  errorMessage: "",
                })
              );
              storeFormDataWithID(ID, formData);
            }
          });
        };

        const uploadFilePromises: any = [];
        // open object manager
        dispatch(openList());
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          uploadFilePromises.push(uploadPromise(file));
        }
        Promise.allSettled(uploadFilePromises).then((results: Array<any>) => {
          const errors = results.filter(
            (result) => result.status === "rejected"
          );
          if (errors.length > 0) {
            const totalFiles = uploadFilePromises.length;
            const successUploadedFiles =
              uploadFilePromises.length - errors.length;
            const err: ErrorResponseHandler = {
              errorMessage: "There were some errors during file upload",
              detailedError: `Uploaded files ${successUploadedFiles}/${totalFiles}`,
            };
            dispatch(setErrorSnackMessage(err));
          }
          // We force objects list reload after all promises were handled
          dispatch(setReloadObjectsList(true));
        });
      };

      upload(files, bucketName, pathPrefix, folderPath);
    },
    [bucketName, dispatch, simplePath, anonymousMode]
  );

  const onDrop = useCallback(
    (acceptedFiles: any[]) => {
      if (acceptedFiles && acceptedFiles.length > 0 && canUpload) {
        let newFolderPath: string = acceptedFiles[0].path;
        //Should we filter by allowed file extensions if any?.
        let allowedFiles = acceptedFiles;

        if (allowedFileExtensions.length > 0) {
          allowedFiles = acceptedFiles.filter((file) => {
            const fileExtn = extractFileExtn(file.name);
            return allowedFileExtensions.includes(fileExtn);
          });
        }

        if (allowedFiles.length) {
          uploadObject(allowedFiles, newFolderPath);
          console.log(
            `${allowedFiles.length} Allowed Files Processed out of ${acceptedFiles.length}.`,
            pathAsResourceInPolicy,
            ...sessionGrantWildCards
          );

          if (allowedFiles.length !== acceptedFiles.length) {
            dispatch(
              setErrorSnackMessage({
                errorMessage: "Upload is restricted.",
                detailedError: permissionTooltipHelper(
                  [IAM_SCOPES.S3_PUT_OBJECT, IAM_SCOPES.S3_PUT_ACTIONS],
                  "upload objects to this location"
                ),
              })
            );
          }
        } else {
          dispatch(
            setErrorSnackMessage({
              errorMessage: "Could not process drag and drop.",
              detailedError: permissionTooltipHelper(
                [IAM_SCOPES.S3_PUT_OBJECT, IAM_SCOPES.S3_PUT_ACTIONS],
                "upload objects to this location"
              ),
            })
          );

          console.error(
            "Could not process drag and drop . upload may be restricted.",
            pathAsResourceInPolicy,
            ...sessionGrantWildCards
          );
        }
      }
      if (!canUpload) {
        dispatch(
          setErrorSnackMessage({
            errorMessage: "Upload not allowed",
            detailedError: permissionTooltipHelper(
              [IAM_SCOPES.S3_PUT_OBJECT, IAM_SCOPES.S3_PUT_ACTIONS],
              "upload objects to this location"
            ),
          })
        );
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadObject]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept } =
    useDropzone({
      noClick: true,
      onDrop,
    });

  const dndStyles = useMemo(
    () => (isDragActive || isDragAccept ? "active" : ""),
    [isDragActive, isDragAccept]
  );

  const closeShareModal = () => {
    dispatch(setShareFileModalOpen(false));
    dispatch(setSelectedPreview(null));
  };

  const rewindCloseModal = () => {
    setRewindSelect(false);
  };

  const closePreviewWindow = () => {
    dispatch(setPreviewOpen(false));
    dispatch(setSelectedPreview(null));
  };

  const onClosePanel = (forceRefresh: boolean) => {
    dispatch(setSelectedObjectView(null));
    dispatch(setVersionsModeEnabled({ status: false }));
    if (detailsOpen && selectedInternalPaths !== null) {
      // We change URL to be the contained folder

      const splitURLS = internalPaths.split("/");

      // We remove the last section of the URL as it should be a file
      splitURLS.pop();

      let URLItem = "";

      if (splitURLS && splitURLS.length > 0) {
        URLItem = `${splitURLS.join("/")}/`;
      }

      navigate(
        `/browser/${encodeURIComponent(bucketName)}/${encodeURIComponent(
          URLItem
        )}`
      );
    }

    dispatch(setObjectDetailsView(false));

    if (forceRefresh) {
      dispatch(setReloadObjectsList(true));
    }
  };

  const closeRenameModal = () => {
    dispatch(setDownloadRenameModal(null));
  };

  const closeAddAccessRule = () => {
    dispatch(setAnonymousAccessOpen(false));
  };

  let createdTime = DateTime.now();

  if (bucketInfo?.creation_date) {
    createdTime = DateTime.fromISO(bucketInfo.creation_date) as DateTime<true>;
  }

  /*let extraOptions: SelectorTypes[] = [];


  if (isVersioningApplied && !!rewindEnabled) {
    extraOptions = [
      {
        label: `${showDeleted ? "Hide" : "Show"} deleted objects`,
        icon: showDeleted ? <VisibilityOffIcon /> : <VisibilityOnIcon />,
        value: "toggleDeleted",
      },
    ];
  }*/

  let titleOptions: ScreenTitleOptions[] = [];

  if (!anonymousMode) {
    titleOptions = [
      {
        title: "Created",
        value: bucketInfo?.creation_date
          ? createdTime.toFormat("ccc, LLL dd yyyy HH:mm:ss (ZZZZ)")
          : "",
      },
      { title: "Access", value: bucketInfo?.access || "" },
      {
        title: "Size",
        value: `${
          bucketInfo?.size
            ? `${niceBytesInt(bucketInfo.size)}${
                !!quota ? ` / ${niceBytesInt(quota.quota || 0)}` : ""
              }`
            : ""
        }${bucketInfo?.size && bucketInfo?.objects ? " - " : ""}
                       
                          
                          ${
                            bucketInfo?.objects
                              ? `${bucketInfo.objects} Object${
                                  bucketInfo.objects && bucketInfo.objects !== 1
                                    ? "s"
                                    : ""
                                }`
                              : ""
                          }`,
      },
    ];
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flexGrow: 1,
      }}
    >
      {shareFileModalOpen && selectedPreview && (
        <ShareFile
          open={shareFileModalOpen}
          closeModalAndRefresh={closeShareModal}
          bucketName={bucketName}
          dataObject={{
            name: selectedPreview.name,
            last_modified: "",
            version_id: selectedPreview.version_id,
          }}
        />
      )}
      {rewindSelect && (
        <RewindEnable
          open={rewindSelect}
          closeModalAndRefresh={rewindCloseModal}
          bucketName={bucketName}
        />
      )}
      {previewOpen && selectedPreview && (
        <PreviewFileModal
          open={previewOpen}
          bucketName={bucketName}
          actualInfo={{
            name: selectedPreview.name || "",
            last_modified: "",
            version_id: selectedPreview.version_id || "",
            size: selectedPreview.size || 0,
          }}
          onClosePreview={closePreviewWindow}
        />
      )}
      {!!downloadRenameModal && (
        <RenameLongFileName
          open={!!downloadRenameModal}
          closeModal={closeRenameModal}
          currentItem={downloadRenameModal.name.split("/")?.pop() || ""}
          bucketName={bucketName}
          internalPaths={internalPaths}
          actualInfo={{
            name: downloadRenameModal.name,
            last_modified: "",
            version_id: downloadRenameModal.version_id,
            size: downloadRenameModal.size,
          }}
        />
      )}
      {anonymousAccessOpen && (
        <AddAccessRule
          onClose={closeAddAccessRule}
          bucket={bucketName}
          modalOpen={anonymousAccessOpen}
          prefilledRoute={`${selectedObjects[0]}*`}
        />
      )}

      <ScreenTitle
        icon={<BucketIcon />}
        superTitle={"Object Browser"}
        title={bucketName!}
        titleOptions={titleOptions}
        sx={{ padding: "12px 24px" }}
        actions={
          <Fragment>
            {!anonymousMode && (
              <Fragment>
                <TooltipWrapper tooltip={"Rewind Bucket"}>
                  <Button
                    id={"rewind-objects-list"}
                    label={"Rewind"}
                    compact
                    icon={
                      <NotificationCount
                        color="danger"
                        dotOnly
                        invisible={!rewindEnabled}
                      >
                        <RewindIcon
                          style={{
                            width: 16,
                            height: 16,
                          }}
                        />
                      </NotificationCount>
                    }
                    onClick={() => {
                      setRewindSelect(true);
                    }}
                    disabled={
                      !isVersioningApplied ||
                      !hasPermission(bucketName, [
                        IAM_SCOPES.S3_GET_OBJECT,
                        IAM_SCOPES.S3_GET_ACTIONS,
                      ])
                    }
                  />
                </TooltipWrapper>
              </Fragment>
            )}
            <ButtonGroup>
              <TooltipWrapper tooltip={"Refresh"}>
                <Button
                  id={"refresh-objects-list"}
                  icon={<RefreshCWIcon />}
                  onClick={() => {
                    if (versionsMode) {
                      dispatch(setLoadingVersions(true));
                    } else {
                      dispatch(resetMessages());
                      dispatch(setReloadObjectsList(true));
                    }
                  }}
                  disabled={
                    anonymousMode
                      ? false
                      : !hasPermission(bucketName, [
                          IAM_SCOPES.S3_LIST_BUCKET,
                          IAM_SCOPES.S3_ALL_LIST_BUCKET,
                        ]) || rewindEnabled
                  }
                />
              </TooltipWrapper>
            </ButtonGroup>
            <input
              type="file"
              multiple
              accept={allowedFileExtensions ? allowedFileExtensions : undefined}
              onChange={handleUploadButton}
              style={{ display: "none" }}
              ref={fileUpload}
            />
            <input
              type="file"
              multiple
              onChange={handleUploadButton}
              style={{ display: "none" }}
              ref={folderUpload}
            />
          </Fragment>
        }
      />

      <EPageLayout>
        {anonymousMode && (
          <div style={{ paddingBottom: 16 }}>
            <FilterObjectsSB />
          </div>
        )}
        <Box
          withBorders
          sx={{
            display: "flex",
            overflow: "hidden",
            borderTop: 0,
            padding: 0,
            width: "100%",
            maxWidth: "100%",
            position: "relative",
            "& .basicPanel": {
              width: 0,
              opacity: 0,
              transitionDuration: "0.3s",
              overflow: "hidden",
            },
            "& .panelVisible": {
              width: "100%",
              opacity: 1,
            },
            "& .sideBarVisible": {
              paddingRight: 24,
            },
            "& .hiddenPage": {
              display: "none",
            },
            "& .hideListOnSmall": {
              "@media (max-width: 799px)": {
                display: "none",
              },
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              transitionDuration: "0.3s",
              padding: "10px 18px",
            }}
          >
            <Box
              className={`basicPanel ${!versionsMode ? "panelVisible" : ""} ${
                versionsMode && panelHidden === "objects" ? "hiddenPage" : ""
              } ${detailsOpen ? "sideBarVisible" : ""}`.trim()}
            >
              <SecureComponent
                scopes={[
                  IAM_SCOPES.S3_LIST_BUCKET,
                  IAM_SCOPES.S3_ALL_LIST_BUCKET,
                ]}
                resource={bucketName!}
                errorProps={{ disabled: true }}
              >
                <Box
                  sx={{
                    width: "100%",
                    position: "relative",
                    "&.detailsOpen": {
                      "@media (max-width: 799px)": {
                        display: "none",
                      },
                    },
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    "& .breadcrumbs-bar": {
                      height: 28,
                    },
                    "& .dropWrapper": {
                      border: `3px transparent dashed`,
                      "&.active": {
                        borderRadius: theme.borderRadius.borderRadius,
                        borderColor:
                          theme.colors[
                            "Color/Brand/Primary/colorPrimaryBorder"
                          ],
                        backgroundColor: theme.colors["Color/Brand/Primary/colorPrimaryBg"],
                      },
                    },
                  }}
                  className={detailsOpen ? "detailsOpen" : ""}
                >
                  {!anonymousMode && (
                    <Fragment>
                      {selectedObjects.length > 0 ? (
                        <Fragment>
                          <MultipleObjectSelection />
                          Multi Select Actions
                        </Fragment>
                      ) : (
                        <BrowserBreadcrumbs
                          bucketName={bucketName!}
                          internalPaths={internalPaths!}
                          hidePathButton={false}
                          uploadButton={
                            <UploadFilesButton
                              bucketName={bucketName!}
                              uploadPath={pathAsResourceInPolicy}
                              uploadFileFunction={() => {
                                if (fileUpload && fileUpload.current) {
                                  fileUpload.current.click();
                                }
                              }}
                              uploadFolderFunction={() => {
                                if (folderUpload && folderUpload.current) {
                                  folderUpload.current.click();
                                }
                              }}
                            />
                          }
                        />
                      )}
                    </Fragment>
                  )}
                  <Box
                    id="object-list-wrapper"
                    {...getRootProps({ className: `dropWrapper ${dndStyles}` })}
                  >
                    <input {...getInputProps()} />
                    <ListObjectsTable />
                  </Box>
                </Box>
              </SecureComponent>
            </Box>
            <Box sx={{ position: "relative", width: 0 }}>
              {detailsOpen && (
                <Button
                  variant={"primary-lighter"}
                  id={"close-details-list"}
                  onClick={() => {
                    onClosePanel(false);
                  }}
                  icon={<ChevronRightIcon />}
                  sx={{
                    zIndex: 10,
                    position: "absolute",
                    padding: 6,
                    height: 22,
                    width: 22,
                    borderRadius: "100%",
                    bottom: 25,
                    left: -10,
                    "&:hover:not(:disabled)": {
                      backgroundColor: "transparent",
                    },
                  }}
                />
              )}
            </Box>
            {!anonymousMode && (
              <SecureComponent
                scopes={[
                  IAM_SCOPES.S3_LIST_BUCKET,
                  IAM_SCOPES.S3_ALL_LIST_BUCKET,
                ]}
                resource={bucketName!}
                errorProps={{ disabled: true }}
              >
                <DetailsListPanel
                  open={detailsOpen}
                  className={`${versionsMode ? "hideListOnSmall" : ""}`}
                >
                  {selectedInternalPaths !== null && (
                    <ObjectDetailPanel
                      internalPaths={selectedInternalPaths}
                      bucketName={bucketName}
                    />
                  )}
                  {selectedObjects.length === 0 &&
                    selectedInternalPaths === null && (
                      <Box>Select a file to see details here</Box>
                    )}
                </DetailsListPanel>
              </SecureComponent>
            )}

            <Box
              className={`basicPanel ${versionsMode ? "panelVisible" : ""} ${
                panelHidden === "versions" ? "hiddenPage" : ""
              }`}
            >
              <Fragment>
                {selectedInternalPaths !== null && (
                  <VersionsNavigator
                    internalPaths={selectedInternalPaths}
                    bucketName={bucketName}
                  />
                )}
              </Fragment>
            </Box>
          </Box>
        </Box>
      </EPageLayout>
    </Box>
  );
};

export default ListObjects;
