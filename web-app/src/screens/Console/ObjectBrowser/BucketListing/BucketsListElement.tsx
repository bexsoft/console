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

import React from "react";
import {
  Box,
  BucketIcon,
  ClusterReplicationIcon,
  FingerprintIcon,
  ShapesIcon,
  SquareStackIcon,
  useMDSTheme
} from "mds";
import { Bucket } from "../../../../api/consoleApi";
import {  niceBytesInt } from "../../../../common/utils";

const BucketsListElement = ({bucketItem, onClick, lastItem}: {bucketItem: Bucket, lastItem: boolean, onClick: (bucket: Bucket) => void}) => {
  const theme = useMDSTheme();

  return (
    <Box className={"bucketListElement"} sx={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 200px",
      height: 72,
      padding: theme.paddingSizes["size"],
      cursor: "pointer",
      borderBottom: !lastItem? `1px solid ${theme.colors["Color/Neutral/Border/colorBorderMinimal"]}` : "none",
      "& .bucketIcon": {
        display: "flex",
        alignItems: "center",
        gap: 16,
        "& svg": {
          color: theme.colors["Color/Neutral/Text/colorTextQuaternary"],
          width: 16,
          height: 16,
        }
      },"&:hover": {
        backgroundColor: theme.colors["Color/Brand/Neutral/colorPrimaryBgHover"]
      }
    }} onClick={() => onClick(bucketItem)}>
      <Box className={"bucketIcon"}>
        <BucketIcon />
        <Box className={"Base_Strong"}>{bucketItem.name}</Box>
      </Box>
      <Box sx={{display: "flex", alignItems: "center", gap: 12, color: theme.colors["Color/Neutral/Text/colorTextTertiary"], "& .infoItem": {display: "flex", alignItems: "center", gap: 12, "& svg": {width: 16, height:16}}}}>
        <Box className={"SM_Normal infoItem"}><ShapesIcon /> {bucketItem.objects ? bucketItem.objects: "0"}</Box>
        <Box className={"SM_Normal infoItem"}><FingerprintIcon />{bucketItem.rw_access?.read ? "R" : ""}{bucketItem.rw_access?.read && bucketItem.rw_access?.write ? "/" : ""}{bucketItem.rw_access?.write ? "W" : ""}</Box>
        <Box className={"SM_Normal infoItem"}>{bucketItem.details?.replication ? <><ClusterReplicationIcon />Replicated</> : ""}</Box>
        <Box className={"SM_Normal infoItem"}>{bucketItem.details?.versioning ? <><SquareStackIcon /> Versioned</> : ""}</Box>
      </Box>
      <Box className="Base_Strong" sx={{display: "flex", alignItems: "center", justifyContent: "flex-end"}}>
        {niceBytesInt(bucketItem.size || 0)}
      </Box>
    </Box>
  );
};

export default BucketsListElement;
