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

import React, { useEffect, useState } from "react";
import {
  AnchorIcon,
  Box,
  Button,
  DateTimeInput,
  FileImageIcon,
  FormLayout,
  Grid,
  Link,
  NotificationAlert,
  RadioGroup,
  Toggle,
  useMDSTheme,
} from "mds";
import { useSelector } from "react-redux";
import { BucketObject, ObjectRetentionMode } from "api/consoleApi";
import { api } from "api";
import { modalStyleUtils } from "../../../../Common/FormComponents/common/styleLibrary";
import { AppState } from "../../../../../../store";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import { DateTime } from "luxon";
import { errorToHandler } from "../../../../../../api/errors";
import { useQueryError } from "../../../../Common/Hooks/useQueryError";

interface ISetRetentionProps {
  open: boolean;
  closeModalAndRefresh: (updateInfo: boolean) => void;
  objectName: string;
  bucketName: string;
  objectInfo: BucketObject;
}

const SetRetention = ({
  open,
  closeModalAndRefresh,
  objectName,
  objectInfo,
  bucketName,
}: ISetRetentionProps) => {
  const theme = useMDSTheme();
  const { notifyError } = useQueryError();

  const retentionConfig = useSelector(
    (state: AppState) => state.objectBrowser.retentionConfig
  );

  const [statusEnabled, setStatusEnabled] = useState<boolean>(true);
  const [type, setType] = useState<ObjectRetentionMode | "">("");
  const [date, setDate] = useState<DateTime>(DateTime.now());
  const [isDateValid, setIsDateValid] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [alreadyConfigured, setAlreadyConfigured] = useState<boolean>(false);

  useEffect(() => {
    if (objectInfo.retention_mode) {
      setType(retentionConfig?.mode || ObjectRetentionMode.Governance);
      setAlreadyConfigured(true);
    }
    // get retention_until_date if defined
    if (objectInfo.retention_until_date) {
      const valueDate = DateTime.fromISO(objectInfo.retention_until_date);

      if(valueDate.isValid) {
        setDate(valueDate);
      }

      setAlreadyConfigured(true);
    }
  }, [objectInfo, retentionConfig?.mode]);

  const dateFieldDisabled = () => {
    return !(statusEnabled && (type === "governance" || type === "compliance"));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const addRetention = (
    selectedObject: string,
    versionId: string | null,
    expireDate: string
  ) => {
    api.buckets
      .putObjectRetention(
        bucketName,
        {
          prefix: selectedObject,
          version_id: versionId || "",
        },
        {
          expires: expireDate,
          mode: type as ObjectRetentionMode,
        }
      )
      .then(() => {
        setIsSaving(false);
        closeModalAndRefresh(true);
      })
      .catch((err) => {
        notifyError(errorToHandler(err.error))
        setIsSaving(false);
      });
  };

  const disableRetention = (
    selectedObject: string,
    versionId: string | null
  ) => {
    api.buckets
      .deleteObjectRetention(bucketName, {
        prefix: selectedObject,
        version_id: versionId || "",
      })
      .then(() => {
        setIsSaving(false);
        closeModalAndRefresh(true);
      })
      .catch((err) => {
        notifyError(errorToHandler(err.error));
        setIsSaving(false);
      });
  };

  const saveNewRetentionPolicy = () => {
    setIsSaving(true);
    const selectedObject = objectInfo.name || "";
    const versionId = objectInfo.version_id || null;

    const expireDate =
      !statusEnabled && type === "governance" ? "" : `${date.toISODate()}T23:59:59Z`;

    if (!statusEnabled && type === "governance") {
      disableRetention(selectedObject, versionId);

      return;
    }

    addRetention(selectedObject, versionId, expireDate);
  };

  const showSwitcher =
    alreadyConfigured && (type === "governance" || type === "");

  return (
    <ModalWrapper
      title="Retention"
      titleIcon={<AnchorIcon />}
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh(false);
      }}
      customWidth={600}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          border: `1px solid ${theme.colors["Color/Neutral/Border/colorBorderMinimal"]}`,
          backgroundColor: theme.colors["Color/Neutral/Bg/colorBgFields"],
          borderRadius: 8,
          padding: theme.paddingSizes["size"],
          gap: 8,
          width: "100%",
          marginBottom: theme.paddingSizes["sizeLG"],
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 8,
            alignItem: "center",
          }}
        >
          <FileImageIcon style={{ width: 20, height: 20 }} />
          <span className={"Base_Strong"}>Object:</span>
        </Box>
        <Box
          className={"Base_Normal"}
          sx={{
            flexGrow: 1,
            width: "100%",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {objectName}
        </Box>
      </Box>
      <NotificationAlert sx={{ marginBottom: theme.paddingSizes["sizeLG"] }}>
        To activate retention types, it has to be activated from the creation of
        the bucket{" "}
        <Link
          href={
            "https://min.io/docs/minio/linux/administration/object-management/object-retention.html#configure-bucket-default-object-retention"
          }
          target={"_blank"}
          rel="noopener"
        >
          learn more here
        </Link>
      </NotificationAlert>
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          onSubmit(e);
        }}
      >
        <FormLayout withBorders={false} containerPadding={false}>
          {showSwitcher && (
            <Toggle
              value="status"
              id="status"
              name="status"
              checked={statusEnabled}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setStatusEnabled(!statusEnabled);
              }}
              label={"Active retention Rules"}
              indicatorLabels={["Enabled", "Disabled"]}
              labelsOn={false}
              helper={"Object Locking must be enabled on this bucket in order to set Retention Rules"}
              inverse
            />
          )}
          <Box
            className={"inputItem"}
            sx={{
              "& .inputItem": {
                display: "initial",
                "& > div": {
                  justifyContent: "flex-start",
                  width: "100%",
                  flexGrow: 1,
                  marginTop: 8,
                  "& > div": {
                    width: "100%",
                    flexGrow: 1,
                  },
                },
              },
            }}
          >
            <RadioGroup
              currentValue={type}
              id="type"
              name="type"
              label="Type"
              disableOptions={
                !statusEnabled || (alreadyConfigured && type !== "")
              }
              onChange={(e) => {
                setType(e.target.value as ObjectRetentionMode);
              }}
              selectorOptions={[
                { label: "Governance", value: ObjectRetentionMode.Governance },
                { label: "Compliance", value: ObjectRetentionMode.Compliance },
              ]}
            />
          </Box>
          <DateTimeInput
            id={"date"}
            value={date}
            onChange={(value) => {
              if (value) {
                setDate(value);
                setIsDateValid(true);
              } else {
                setIsDateValid(false);
              }
            }}
            secondsSelector={false}
            mode={"date"}
            disabled={dateFieldDisabled()}
          />
          <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
            <Button
              id={"reset"}
              type="button"
              variant="secondary"
              onClick={() => {
                closeModalAndRefresh(false);
              }}
              label={"Cancel"}
            />
            <Button
              id={"save"}
              type="submit"
              variant="primary"
              disabled={
                (statusEnabled && type === "") ||
                (statusEnabled && !isDateValid) ||
                isSaving
              }
              onClick={saveNewRetentionPolicy}
              label={"Save"}
            />
          </Grid>
        </FormLayout>
      </form>
    </ModalWrapper>
  );
};

export default SetRetention;
