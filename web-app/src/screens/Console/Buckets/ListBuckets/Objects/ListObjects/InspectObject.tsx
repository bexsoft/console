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

import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  KeyRoundIcon,
  Link,
  NotificationAlert,
  ScanEyeIcon,
} from "mds";
import {
  deleteCookie,
  getCookieValue,
  performDownload,
} from "../../../../../../common/utils";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import { modalStyleUtils } from "../../../../Common/FormComponents/common/styleLibrary";
import KeyRevealer from "../../../../Tools/KeyRevealer";
import { useQueryError } from "../../../../Common/Hooks/useQueryError";

interface IInspectObjectProps {
  closeInspectModalAndRefresh: (refresh: boolean) => void;
  inspectOpen: boolean;
  inspectPath: string;
  volumeName: string;
}

const InspectObject = ({
  closeInspectModalAndRefresh,
  inspectOpen,
  inspectPath,
  volumeName,
}: IInspectObjectProps) => {
  const { notifyError } = useQueryError();

  const onClose = () => closeInspectModalAndRefresh(false);
  const [isEncrypt, setIsEncrypt] = useState<boolean>(true);
  const [decryptionKey, setDecryptionKey] = useState<string>("");
  const [insFileName, setInsFileName] = useState<string>("");

  if (!inspectPath) {
    return null;
  }
  const makeRequest = async (url: string) => {
    return await fetch(url, { method: "GET" });
  };

  const performInspect = async () => {
    let basename = document.baseURI.replace(window.location.origin, "");
    const urlOfInspectApi = `${
      window.location.origin
    }${basename}/api/v1/admin/inspect?volume=${encodeURIComponent(
      volumeName
    )}&file=${encodeURIComponent(
      inspectPath + "/xl.meta"
    )}&encrypt=${isEncrypt}`;

    makeRequest(urlOfInspectApi)
      .then(async (res) => {
        if (!res.ok) {
          const resErr: any = await res.json();

          notifyError({
            errorMessage: resErr.message,
            detailedError: resErr.code,
          });
        }
        const blob: Blob = await res.blob();

        //@ts-ignore
        const filename = res.headers.get("content-disposition").split('"')[1];
        const decryptKey = getCookieValue(filename) || "";

        performDownload(blob, filename);
        setInsFileName(filename);
        if (decryptKey === "") {
          onClose();
          return;
        }
        setDecryptionKey(decryptKey);
      })
      .catch((err) => {
        notifyError(err);
      });
  };

  const onCloseDecKeyModal = () => {
    deleteCookie(insFileName);
    onClose();
    setDecryptionKey("");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <React.Fragment>
      {!decryptionKey && (
        <ModalWrapper
          modalOpen={inspectOpen}
          titleIcon={<ScanEyeIcon />}
          title={`Inspect Object`}
          onClose={onClose}
          customWidth={608}
        >
          Inspect will produce non-human-readable xl.meta binary file containing
          the data and metadata associated to this object, which is intended for
          troubleshooting use by MinIO Engineering. For more information{" "}
          <Link
            href={
              "https://min.io/docs/minio/linux/reference/minio-mc/mc-support-inspect.html"
            }
            target={"_blank"}
            rel="noopener"
          >
            visit this.
          </Link>
          <form
            noValidate
            autoComplete="off"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              onSubmit(e);
            }}
          >
            <Box
              sx={{
                margin: "24px 0",
                display: "flex",
                gap: 16,
                "& .inputItem": {
                  width: "initial",
                },
              }}
            >
              <Checkbox
                checked={isEncrypt}
                value={"encrypt"}
                id="encrypt"
                name="encrypt"
                onChange={(e) => {
                  setIsEncrypt(!isEncrypt);
                }}
              />
              <Box>{`Encrypt ${inspectPath} inspection report`}</Box>
            </Box>
            <NotificationAlert variant={"warning"}>
              This report may contain internal or private data points. It can be
              encrypted for enhanced security, and decrypted using MinIO’s{" "}
              <Link
                href={
                  "https://min.io/docs/minio/linux/operations/troubleshooting/encrypting-files.html#decryption"
                }
                target={"_blank"}
                rel="noopener"
              >
                decrypted tool.
              </Link>
            </NotificationAlert>
            <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
              <Button
                id={"cancel"}
                variant="secondary"
                onClick={onClose}
                label={"Cancel"}
              />
              <Button
                id={"inspect"}
                type="submit"
                variant="primary"
                color="primary"
                onClick={performInspect}
                label={"Inspect"}
              />
            </Grid>
          </form>
        </ModalWrapper>
      )}
      {decryptionKey ? (
        <ModalWrapper
          modalOpen={inspectOpen}
          title="Inspect Decryption Key"
          onClose={onCloseDecKeyModal}
          titleIcon={<KeyRoundIcon />}
        >
          <Box>
            This will be displayed only once. It cannot be recovered.
            <br />
            Use secure medium to share this key.
          </Box>
          <Box>
            <KeyRevealer value={decryptionKey} />
          </Box>
        </ModalWrapper>
      ) : null}
    </React.Fragment>
  );
};

export default InspectObject;
