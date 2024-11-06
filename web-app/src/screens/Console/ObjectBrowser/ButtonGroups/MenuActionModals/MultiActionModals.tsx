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

import React, { Fragment, lazy } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNotification } from "mds";
import { AppState, useAppDispatch } from "../../../../../store";
import { setDeleteMultipleOpen, setReloadObjectsList, setSelectedObjects } from "../../objectBrowserSlice";
import DeleteMultipleObjects from "../../../Buckets/ListBuckets/Objects/ListObjects/DeleteMultipleObjects";

const MultiActionModals = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const notification = useNotification();

  const bucketName = params.bucketName || "";

  const selectedObjects = useSelector(
    (state: AppState) => state.objectBrowser.selectedObjects,
  );
  const versioningConfig = useSelector(
    (state: AppState) => state.objectBrowser.versionInfo,
  );
  const deleteMultipleOpen = useSelector(
    (state: AppState) => state.objectBrowser.multiObjectModals.deleteMultiple,
  );

  const closeDeleteMultipleModalAndRefresh = (refresh: boolean) => {
    dispatch(setDeleteMultipleOpen(false));

    if (refresh) {
      notification.success(`Objects deleted successfully.`);
      dispatch(setSelectedObjects([]));
      dispatch(setReloadObjectsList(true));
    }
  };

  return (
    <Fragment>
      {deleteMultipleOpen && (
        <DeleteMultipleObjects
          deleteOpen={deleteMultipleOpen}
          selectedBucket={bucketName}
          selectedObjects={selectedObjects}
          closeDeleteModalAndRefresh={closeDeleteMultipleModalAndRefresh}
          versioning={versioningConfig}
        />
      )}
    </Fragment>
  );
};

export default MultiActionModals;
