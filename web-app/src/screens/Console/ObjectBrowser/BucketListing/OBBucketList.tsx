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

import { useNavigate } from "react-router-dom";
import {
  Box,
  BucketIcon,
  Button,
  CompassIcon,
  Grid,
  HelpBox,
  LinkButton,
  ProgressBar,
  RefreshCWIcon,
  ScreenTitle,
} from "mds";
import { SecureComponent } from "../../../../common/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../common/SecureComponent/permissions";
import SearchBox from "../../Common/SearchBox";
import hasPermission from "../../../../common/SecureComponent/accessControl";
import { setErrorSnackMessage, setHelpName } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { useSelector } from "react-redux";
import { selFeatures } from "../../consoleSlice";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";
import { Bucket } from "../../../../api/consoleApi";
import { api } from "../../../../api";
import { errorToHandler } from "../../../../api/errors";
import EPageLayout from "../../Common/EPageLayout/EPageLayout";
import BucketsListElement from "./BucketsListElement";
import VirtualizedList from "../../Common/VirtualizedList/VirtualizedList";

const OBListBuckets = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [records, setRecords] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [clickOverride, setClickOverride] = useState<boolean>(false);
  const [filterBuckets, setFilterBuckets] = useState<string>("");

  const features = useSelector(selFeatures);
  const obOnly = !!features?.includes("object-browser-only");

  useEffect(() => {
    if (loading) {
      const fetchRecords = () => {
        setLoading(true);
        api.buckets
          .listBuckets()
          .then((res) => {
            if (res.data) {
              setLoading(false);
              setRecords(res.data.buckets || []);
            }
          })
          .catch((err) => {
            setLoading(false);
            dispatch(setErrorSnackMessage(errorToHandler(err)));
          });

        api.admin.adminInfo().then((res) => {
          if (res.data) {
            console.log(res.data);
          }
        });
      };
      fetchRecords();
    }
  }, [loading, dispatch]);

  const filteredRecords = records.filter((b: Bucket) => {
    if (filterBuckets === "") {
      return true;
    } else {
      return b.name.indexOf(filterBuckets) >= 0;
    }
  });

  const hasBuckets = records.length > 0;

  const canListBuckets = hasPermission("*", [
    IAM_SCOPES.S3_LIST_BUCKET,
    IAM_SCOPES.S3_ALL_LIST_BUCKET,
  ]);

  const clickBucketItem = (bucket: Bucket) => {
    !clickOverride &&
      navigate(`${IAM_PAGES.OBJECT_BROWSER_VIEW}/${bucket.name}`);
  };

  useEffect(() => {
    dispatch(setHelpName("object_browser"));
  }, [dispatch]);

  return (
    <Fragment>
      {!obOnly && (
        <ScreenTitle
          icon={<CompassIcon />}
          title={"Object Browser"}
          sx={{ padding: "12px 24px" }}
          actions={
            <Fragment>
              {hasBuckets && (
                <SearchBox
                  onChange={setFilterBuckets}
                  placeholder="Filter Buckets"
                  value={filterBuckets}
                  sx={{
                    minWidth: 380,
                    "@media (max-width: 900px)": {
                      minWidth: 220,
                    },
                  }}
                />
              )}
              <TooltipWrapper tooltip={"Refresh"}>
                <Button
                  id={"refresh-buckets"}
                  onClick={() => {
                    setLoading(true);
                  }}
                  icon={<RefreshCWIcon />}
                  variant={"secondary"}
                  compact
                />
              </TooltipWrapper>
            </Fragment>
          }
        />
      )}

      <EPageLayout>
        {loading && <ProgressBar />}
        {!loading && (
          <Box sx={{ padding: 24 }}>
            <Box
              sx={(theme) => ({
                height: "calc(100vh - 170px)",
                border: `1px solid ${theme.colors["Color/Neutral/Border/colorBorderMinimal"]}`,
                borderRadius: theme.borderRadius["borderRadiusLG"],
                overflow: "hidden",
                "&.isEmbedded": {
                  height: "calc(100vh - 128px)",
                },
                "& > div:last-child": {
                  borderBottom: 0,
                },
              })}
              className={obOnly ? "isEmbedded" : ""}
            >
              {filteredRecords.length !== 0 && (
                <VirtualizedList
                  rowRenderFunction={(index) => (
                    <BucketsListElement
                      bucketItem={filteredRecords[index]}
                      onClick={clickBucketItem}
                      key={`listElement-${index}`}
                      lastItem={index === filteredRecords.length - 1}
                    />
                  )}
                  totalItems={filteredRecords.length}
                  defaultHeight={72}
                />
              )}
              {filteredRecords.length === 0 && filterBuckets !== "" && (
                <Grid
                  container
                  sx={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Grid item xs={8}>
                    <HelpBox
                      icon={<BucketIcon />}
                      title={"No Results"}
                      help={
                        <Fragment>
                          No buckets match the filtering condition
                        </Fragment>
                      }
                    />
                  </Grid>
                </Grid>
              )}
              {!hasBuckets && (
                <Grid
                  container
                  sx={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Grid item xs={8}>
                    <HelpBox
                      icon={<BucketIcon />}
                      title={"Buckets"}
                      help={
                        <Fragment>
                          MinIO uses buckets to organize objects. A bucket is
                          similar to a folder or directory in a filesystem,
                          where each bucket can hold an arbitrary number of
                          objects.
                          <br />
                          {canListBuckets ? (
                            ""
                          ) : (
                            <Fragment>
                              <br />
                              {permissionTooltipHelper(
                                [
                                  IAM_SCOPES.S3_LIST_BUCKET,
                                  IAM_SCOPES.S3_ALL_LIST_BUCKET,
                                ],
                                "view the buckets on this server"
                              )}
                              <br />
                            </Fragment>
                          )}
                          <SecureComponent
                            scopes={[IAM_SCOPES.S3_CREATE_BUCKET]}
                            resource={CONSOLE_UI_RESOURCE}
                          >
                            <br />
                            To get started,&nbsp;
                            <LinkButton
                              onClick={() => {
                                navigate(IAM_PAGES.ADD_BUCKETS);
                              }}
                            >
                              Create a Bucket.
                            </LinkButton>
                          </SecureComponent>
                        </Fragment>
                      }
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
          </Box>
        )}
      </EPageLayout>
    </Fragment>
  );
};

export default OBListBuckets;
