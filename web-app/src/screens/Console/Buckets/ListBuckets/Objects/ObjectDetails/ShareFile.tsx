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

import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  CopyIcon,
  Grid,
  InputBox,
  NotificationAlert,
  ProgressBar,
  ShareIcon,
  Tooltip,
  useMDSTheme, useNotification
} from "mds";
import CopyToClipboard from "react-copy-to-clipboard";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import DaysSelector from "../../../../Common/FormComponents/DaysSelector/DaysSelector";
import { niceTimeFromSeconds } from "../../../../../../common/utils";
import {
  selDistSet,
  setModalErrorSnackMessage,
  setModalSnackMessage,
} from "../../../../../../systemSlice";
import { useAppDispatch } from "../../../../../../store";
import { BucketObject } from "api/consoleApi";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { getMaxShareLinkExpTime } from "screens/Console/ObjectBrowser/objectBrowserThunks";
import { maxShareLinkExpTime } from "screens/Console/ObjectBrowser/objectBrowserSlice";
import debounce from "lodash/debounce";
import { DateTime } from "luxon";

interface IShareFileProps {
  open: boolean;
  bucketName: string;
  dataObject: BucketObject;
  closeModalAndRefresh: () => void;
}

const ShareFile = ({
  open,
  closeModalAndRefresh,
  bucketName,
  dataObject,
}: IShareFileProps) => {
  const dispatch = useAppDispatch();
  const theme = useMDSTheme();
  const notification = useNotification();

  const distributedSetup = useSelector(selDistSet);
  const maxShareLinkExpTimeVal = useSelector(maxShareLinkExpTime);
  const [shareURL, setShareURL] = useState<string>("");
  const [isLoadingVersion, setIsLoadingVersion] = useState<boolean>(true);
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dateValid, setDateValid] = useState<boolean>(true);
  const [versionID, setVersionID] = useState<string>("null");

  const debouncedDateChange = debounce((newDate: string, isValid: boolean) => {
    setDateValid(isValid);
    if (isValid) {
      setSelectedDate(newDate);
      return;
    }
    setSelectedDate("");
    setShareURL("");
  }, 300);

  useEffect(() => {
    dispatch(getMaxShareLinkExpTime());
  }, [dispatch]);

  useEffect(() => {
    // In case version is undefined, we get the latest version of the object
    if (dataObject.version_id === undefined) {
      // In case it is not distributed setup, then we default to "null";
      if (distributedSetup) {
        api.buckets
          .listObjects(bucketName, {
            prefix: dataObject.name || "",
            with_versions: distributedSetup,
          })
          .then((res) => {
            const result: BucketObject[] = res.data.objects || [];

            const latestVersion: BucketObject | undefined = result.find(
              (elem: BucketObject) => elem.is_latest
            );

            if (latestVersion) {
              setVersionID(`${latestVersion.version_id}`);
              return;
            }

            // Version couldn't be retrieved, we default
            setVersionID("null");
          })
          .catch((err) => {
            dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
          });

        setIsLoadingVersion(false);
        return;
      }
      setVersionID("null");
      setIsLoadingVersion(false);
      return;
    }
    setVersionID(dataObject.version_id || "null");
    setIsLoadingVersion(false);
  }, [bucketName, dataObject, distributedSetup, dispatch]);

  useEffect(() => {
    if (dateValid && !isLoadingVersion) {
      setIsLoadingFile(true);
      setShareURL("");

      const slDate = new Date(`${selectedDate}`);
      const currDate = new Date();

      const diffDate = Math.ceil(
        (slDate.getTime() - currDate.getTime()) / 1000
      );

      if (diffDate > 0) {
        api.buckets
          .shareObject(bucketName, {
            prefix: dataObject.name || "",
            version_id: versionID,
            expires: selectedDate !== "" ? `${diffDate}s` : "",
          })
          .then((res) => {
            setShareURL(res.data);
            setIsLoadingFile(false);
          })
          .catch((err) => {
            dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
            setShareURL("");
            setIsLoadingFile(false);
          });
      }
    }
  }, [
    dataObject,
    selectedDate,
    bucketName,
    dateValid,
    setShareURL,
    dispatch,
    distributedSetup,
    isLoadingVersion,
    versionID,
  ]);

  return (
    <React.Fragment>
      <ModalWrapper
        title="Share File"
        titleIcon={<ShareIcon style={{ fill: "#4CCB92" }} />}
        modalOpen={open}
        onClose={() => {
          closeModalAndRefresh();
        }}
        customWidth={400}
      >
        {isLoadingVersion && (
          <Grid item xs={12}>
            <ProgressBar />
          </Grid>
        )}
        {!isLoadingVersion && (
          <Fragment>
            <Grid
              item
              xs={12}
              sx={{
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              <Tooltip
                placement="right"
                tooltip={
                  <span>
                    You can reset your session by logging out and logging back
                    in to the web UI. <br /> <br />
                    You can increase the maximum configuration time by setting
                    the MINIO_STS_DURATION environment variable on all your
                    nodes. <br /> <br />
                    You can use <b>mc share</b> as an alternative to this UI,
                    where the session length does not limit the URL validity.
                  </span>
                }
              >
                <Box>
                  <NotificationAlert>
                    The following URL lets you share this object without
                    requiring a login.
                  </NotificationAlert>
                  <Box
                    className={"Base_Normal"}
                    sx={{
                      marginTop: 24,
                    }}
                  >
                    The URL expires automatically at the earlier of your
                    configured time{" "}
                    <span className={"Base_Strong"}>
                      ({niceTimeFromSeconds(maxShareLinkExpTimeVal)})
                    </span>{" "}
                    or the expiration of your current web session.
                  </Box>
                </Box>
              </Tooltip>
            </Grid>
            <br />
            <Grid item xs={12}>
              <DaysSelector
                id="date"
                label="Active for:"
                maxSeconds={maxShareLinkExpTimeVal}
                onChange={debouncedDateChange}
              />
            </Grid>
            <Box
              sx={{
                backgroundColor: theme.colors["Color/Base/Shark/0"],
                padding: theme.paddingSizes["size"],
                borderRadius: 8,
                marginTop: theme.paddingSizes["sizeLG"],
              }}
            >
              {selectedDate ? (
                <div className={"validityText"}>
                  <Box className={"Base_Normal"} sx={{marginBottom: 4,}}>
                    Link will be available until:
                    <span className={"Base_Strong"}>
                      {DateTime.fromISO(selectedDate).toFormat(
                        "MM/dd/yyyy HH:mm:ss ZZZZ"
                      )}
                    </span>
                  </Box>
                  <InputBox
                    id={"shareURL"}
                    sizeMode={"small"}
                    readOnly
                    value={shareURL}
                    overlayObject={
                      <CopyToClipboard text={shareURL}>
                        <Button
                          id={"copy-path"}
                          variant="secondary"
                          onClick={() => {
                              notification.information("URL Copied to clipboard", {position: "bottom-right"});
                          }}
                          disabled={shareURL === "" || isLoadingFile}
                          icon={<CopyIcon />}
                        />
                      </CopyToClipboard>
                    }
                  />
                </div>
              ) : (
                <div className={"invalidDurationText"}>
                  Please select a valid duration.
                </div>
              )}
            </Box>
          </Fragment>
        )}
      </ModalWrapper>
    </React.Fragment>
  );
};

export default ShareFile;
