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
import get from "lodash/get";
import { Box, Button, FeatherIcon, FormLayout, Grid, Toggle, useMDSTheme } from "mds";
import { BucketObject, ObjectLegalHoldStatus } from "api/consoleApi";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { modalStyleUtils } from "../../../../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../../../../systemSlice";
import { useAppDispatch } from "../../../../../../store";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";

interface ISetRetentionProps {
  open: boolean;
  closeModalAndRefresh: (reload: boolean) => void;
  objectName: string;
  bucketName: string;
  actualInfo: BucketObject;
}

const SetLegalHoldModal = ({
  open,
  closeModalAndRefresh,
  objectName,
  bucketName,
  actualInfo,
}: ISetRetentionProps) => {
  const dispatch = useAppDispatch();
  const theme = useMDSTheme();

  const [legalHoldEnabled, setLegalHoldEnabled] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const versionId = actualInfo.version_id;

  useEffect(() => {
    const status = get(actualInfo, "legal_hold_status", "OFF");
    setLegalHoldEnabled(status === "ON");
  }, [actualInfo]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    api.buckets
      .putObjectLegalHold(
        bucketName,
        {
          prefix: objectName,
          version_id: versionId || "",
        },
        {
          status: legalHoldEnabled
            ? ObjectLegalHoldStatus.Enabled
            : ObjectLegalHoldStatus.Disabled,
        }
      )
      .then(() => {
        setIsSaving(false);
        closeModalAndRefresh(true);
      })
      .catch((err) => {
        dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
        setIsSaving(false);
      });
  };

  return (
    <ModalWrapper
      title="Set Legal Hold"
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh(false);
      }}
      titleIcon={<FeatherIcon />}
      customWidth={608}
    >
      <Box
        sx={{
          backgroundColor:
            theme.colors["Color/Brand/Neutral/colorPrimaryBg"],
          display: "flex",
          gap: 8,
          padding: theme.paddingSizes["size"],
          borderRadius: 8,
          marginBottom: theme.paddingSizes["sizeLG"],
        }}
      >
        <Box
          className={"Base_Strong"}
          sx={{ color: theme.colors["Color/Neutral/Text/colorTextLabel"] }}
        >
          Object:
        </Box>
        <Box
          className="Base_Normal"
          sx={{ color: theme.colors["Color/Neutral/Text/colorTextLabel"], flexGrow: 1, width: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {bucketName + "/" + objectName}
        </Box>
      </Box>
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          onSubmit(e);
        }}
      >
        <FormLayout withBorders={false} containerPadding={false}>
          <Toggle
            value="legalhold"
            id="legalhold"
            name="legalhold"
            checked={legalHoldEnabled}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setLegalHoldEnabled(!legalHoldEnabled);
            }}
            label={"Legal Hold Status"}
            indicatorLabels={["Enabled", "Disabled"]}
            helper={
              "To enable this feature you need to enable versioning on the bucket before creation"
            }
            inverse
          />
          <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
            <Button
              id={"clear"}
              type="button"
              variant="secondary"
              onClick={() => closeModalAndRefresh(false)}
              label={"Cancel"}
            />
            <Button
              id={"save"}
              type="submit"
              variant="primary"
              disabled={isSaving}
              label={" Save"}
            />
          </Grid>
        </FormLayout>
      </form>
    </ModalWrapper>
  );
};

export default SetLegalHoldModal;
