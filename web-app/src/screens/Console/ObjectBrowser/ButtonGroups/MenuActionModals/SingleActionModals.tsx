import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppState, useAppDispatch } from "../../../../../store";
import { selDistSet } from "../../../../../systemSlice";
import {
  resetMessages, setDeleteObjectOpen, setInspectOpen, setLegalHoldOpen, setLoadingObjectInfo,
  setLoadingVersions,
  setObjectInfo,
  setObjectMetadata,
  setReloadObjectsList, setRetentionOpen, setSelectedVersion
} from "../../objectBrowserSlice";
import SetLegalHoldModal from "../../../Buckets/ListBuckets/Objects/ObjectDetails/SetLegalHoldModal";
import InspectObject from "../../../Buckets/ListBuckets/Objects/ListObjects/InspectObject";
import SetRetention from "../../../Buckets/ListBuckets/Objects/ObjectDetails/SetRetention";
import DeleteObject from "../../../Buckets/ListBuckets/Objects/ListObjects/DeleteObject";
import { useNotification } from "mds";



const SingleActionModals = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notification = useNotification();

  const params = useParams();
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
  const versioningConfig = useSelector(
    (state: AppState) => state.objectBrowser.versionInfo,
  );
  const legalHoldOpen = useSelector(
    (state: AppState) => state.objectBrowser.singleObjectModals.legalHoldOpen,
  );
  const inspectModalOpen = useSelector(
    (state: AppState) => state.objectBrowser.singleObjectModals.inspectOpen,
  );
  const retentionModalOpen = useSelector(
    (state: AppState) => state.objectBrowser.singleObjectModals.retentionOpen,
  );
  const deleteOpen = useSelector(
    (state: AppState) =>
      state.objectBrowser.singleObjectModals.deleteObjectOpen,
  );

  const distributedSetup = useSelector(selDistSet);

  const allPathData = (selectedInternalPaths || "").split("/");
  const currentItem = allPathData.pop() || "";

  /*Modal Close Actions*/
  const closeDeleteModal = (closeAndReload: boolean) => {
    dispatch(setDeleteObjectOpen(false));

    if (closeAndReload && selectedVersion === "") {
      dispatch(setObjectInfo(null));
      dispatch(setObjectMetadata(null));
      dispatch(resetMessages());
      dispatch(setReloadObjectsList(true));
      notification.success("Object deleted successfully", {position: "bottom-right"});

      navigate(
        `../${encodeURIComponent(bucketName)}/${encodeURIComponent(`${allPathData.join("/")}/`)}`,
      );
    } else {
      dispatch(setLoadingVersions(true));
      dispatch(setSelectedVersion(""));
      dispatch(setLoadingObjectInfo(true));
    }
  };

  const closeLegalHoldModal = (reload: boolean) => {
    dispatch(setLegalHoldOpen(false));
    if (reload) {
      notification.success("Legal Hold Status Changed", {position: "bottom-right"});
      dispatch(setLoadingObjectInfo(true));
    }
  };

  const closeInspectModal = (reloadObjectData: boolean) => {
    dispatch(setInspectOpen(false));
    if (reloadObjectData) {
      dispatch(setLoadingObjectInfo(true));
    }
  };

  const closeRetentionModal = (updateInfo: boolean) => {
    dispatch(setRetentionOpen(false));
    if (updateInfo) {
      notification.success("Retention Status Changed", {position: "bottom-right"});
      dispatch(setLoadingObjectInfo(true));
    }
  };

  return (
    <Fragment>
      {legalHoldOpen && actualInfo && (
        <SetLegalHoldModal
          open={legalHoldOpen}
          closeModalAndRefresh={closeLegalHoldModal}
          objectName={actualInfo.name || ""}
          bucketName={bucketName}
          actualInfo={actualInfo}
        />
      )}
      {inspectModalOpen && actualInfo && (
        <InspectObject
          inspectOpen={inspectModalOpen}
          volumeName={bucketName}
          inspectPath={actualInfo.name || ""}
          closeInspectModalAndRefresh={closeInspectModal}
        />
      )}
      {retentionModalOpen && actualInfo && (
        <SetRetention
          open={retentionModalOpen}
          closeModalAndRefresh={closeRetentionModal}
          objectName={currentItem}
          objectInfo={actualInfo}
          bucketName={bucketName}
        />
      )}
      {deleteOpen && (
        <DeleteObject
          deleteOpen={deleteOpen}
          selectedBucket={bucketName}
          selectedObject={selectedInternalPaths || ""}
          closeDeleteModalAndRefresh={closeDeleteModal}
          versioningInfo={distributedSetup ? versioningConfig : undefined}
          selectedVersion={selectedVersion}
        />
      )}
    </Fragment>
  );
};

export default SingleActionModals;
