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

import React, { useState } from "react";
import * as cicons from "mds";
import * as micons from "mds";
import { Box, Grid, Loader, RadioGroup } from "mds";

const IconsScreen = () => {
  const [color, setColor] = useState<string>("default");
  return (
    <Box
      sx={{
        position: "relative" as const,
        padding: "20px 35px 0",
        "& h6": {
          color: "#777777",
          fontSize: 30,
        },
        "& p": {
          "& span:not(*[class*='smallUnit'])": {
            fontSize: 16,
          },
        },
      }}
    >
      <Grid container>
        <RadioGroup
          selectorOptions={[
            { value: "def", label: "Default" },
            { value: "red", label: "Color" },
          ]}
          currentValue={color}
          id={"color-selector"}
          name={"color-selector"}
          onChange={(c) => {
            setColor(c.target.value);
          }}
        />
      </Grid>
      <h1>Logos</h1>
      <Grid
        container
        sx={{
          fontSize: 12,
          wordWrap: "break-word",
          "& .min-loader": {
            width: 45,
            height: 45,
          },
          "& .min-icon": {
            color: color === "red" ? "red" : "black",
          },
        }}
      >
        <Grid item xs={3}>
          <cicons.ThemedLogo />
          <br />
          ThemedLogo
        </Grid>
      </Grid>
      <h1>Loaders</h1>
      <Grid
        container
        sx={{
          fontSize: 12,
          wordWrap: "break-word",
          "& .min-loader": {
            width: 45,
            height: 45,
          },
          "& .min-icon": {
            color: color === "red" ? "red" : "black",
          },
        }}
      >
        <Grid item xs={3}>
          <Loader />
          <br />
          Loader
        </Grid>
      </Grid>
      <h1>Icons</h1>
      <Grid
        container
        sx={{
          fontSize: 12,
          wordWrap: "break-word",
          "& .min-loader": {
            width: 45,
            height: 45,
          },
          "& .min-icon": {
            color: color === "red" ? "red" : "black",
          },
        }}
      >
        <Grid item xs={3} sm={2} md={1}>
          <cicons.UserRoundIcon />
          <br />
          UserRoundIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.CirclePlusIcon />
          <br />
          CirclePlusIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FolderPlusIcon />
          <br />
          FolderPlusIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.PlusIcon />
          <br />
          PlusIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.UserPlusIcon />
          <br />
          UserPlusIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.TagIcon />
          <br />
          TagIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.CircleAlertIcon />
          <br />
          CircleAlertIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.BucketIcon />
          <br />
          BucketIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.ArrowRightIcon />
          <br />
          ArrowRightIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.ArrowRightIcon />
          <br />
          ArrowRightIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.AzureAksSiteIcon />
          <br />
          AzureAksSiteIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.AzureAksSiteIcon />
          <br />
          AzureAksSiteIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.ArrowLeftIcon />
          <br />
          ArrowLeftIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.LockKeyholeIcon />
          <br />
          LockKeyholeIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.BucketQuotaIcon />
          <br />
          BucketQuotaIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.BucketCopyIcon />
          <br />
          BucketCopyIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.BucketIcon />
          <br />
          BucketIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.CalendarIcon />
          <br />
          CalendarIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.CircleXIcon />
          <br />
          CircleXIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.PencilLineIcon />
          <br />
          PencilLineIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.KeyRoundIcon />
          <br />
          KeyRoundIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.CircleIcon />
          <br />
          CircleIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.ArrowRightToLineIcon />
          <br />
          ArrowRightToLineIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.ClustersIcon />
          <br />
          ClustersIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.CollapseIcon />
          <br />
          CollapseIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.CircleXIcon />
          <br />
          CircleXIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.CircleCheckBigIcon />
          <br />
          CircleCheckBigIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.SquareTerminalIcon />
          <br />
          SquareTerminalIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.CopyIcon />
          <br />
          CopyIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.UserRoundPlusIcon />
          <br />
          UserRoundPlusIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FolderPlusIcon />
          <br />
          FolderPlusIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.UserPlusIcon />
          <br />
          UserPlusIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.DeleteIcon />
          <br />
          DeleteIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.TrashIcon />
          <br />
          TrashIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.ActivityIcon />
          <br />
          ActivityIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.CircleOffIcon />
          <br />
          CircleOffIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.BookTextIcon />
          <br />
          BookTextIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.DownloadIcon />
          <br />
          DownloadIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.CloudDownloadIcon />
          <br />
          CloudDownloadIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.HardDriveIcon />
          <br />
          HardDriveIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.PencilIcon />
          <br />
          PencilIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.TagIcon />
          <br />
          TagIcon
        </Grid>
        
        <Grid item xs={3} sm={2} md={1}>
          <cicons.CircleCheckBigIcon />
          <br />
          CircleCheckBigIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.MessageCirclePlusIcon />
          <br />
          MessageCirclePlusIcon
        </Grid>


        <Grid item xs={3} sm={2} md={1}>
          <cicons.FileTextIcon />
          <br />
          FileTextIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FileCodeIcon />
          <br />
          FileCodeIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FileCogIcon />
          <br />
          FileCogIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FileHeartIcon />
          <br />
          FileHeartIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FileType2Icon />
          <br />
          FileType2Icon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FileImageIcon />
          <br />
          FileImageIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FileBoxIcon />
          <br />
          FileBoxIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FileLockIcon />
          <br />
          FileLockIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FileQuestionIcon />
          <br />
          FileQuestionIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FileMusicIcon />
          <br />
          FileMusicIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FileType2Icon />
          <br />
          FileType2Icon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FileClockIcon />
          <br />
          FileClockIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FileTextIcon />
          <br />
          FileTextIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FileVideoIcon />
          <br />
          FileVideoIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FileTextIcon />
          <br />
          FileTextIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FileBarChart2Icon />
          <br />
          FileBarChart2Icon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FileArchiveIcon />
          <br />
          FileArchiveIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FolderIcon />
          <br />
          FolderIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.HardDriveDownloadIcon />
          <br />
          HardDriveDownloadIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.GoogleGkeSiteIcon />
          <br />
          GoogleGkeSiteIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.GoogleGkeSiteIcon />
          <br />
          GoogleGkeSiteIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.UsersIcon />
          <br />
          UsersIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.HammerIcon />
          <br />
          HammerIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.HospitalIcon />
          <br />
          HospitalIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.CircleHelpIcon />
          <br />
          CircleHelpIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.CircleHelpIcon />
          <br />
          CircleHelpIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.HistoryIcon />
          <br />
          HistoryIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.ShieldCheckIcon />
          <br />
          ShieldCheckIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.InfoIcon />
          <br />
          InfoIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.BracesIcon />
          <br />
          BracesIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.LambdaIcon />
          <br />
          LambdaIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.LambdaIcon />
          <br />
          LambdaIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.BalancerIcon />
          <br />
          BalancerIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.BookOpenTextIcon />
          <br />
          BookOpenTextIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.RefreshCCWDotIcon />
          <br />
          RefreshCCWDotIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.LinkIcon />
          <br />
          LinkIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.LockIcon />
          <br />
          LockIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.LogOutIcon />
          <br />
          LogOutIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.NotebookTextIcon />
          <br />
          NotebookTextIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.DataIcon />
          <br />
          DataIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.MinIOIcon />
          <br />
          MinIOIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.MinIOIcon />
          <br />
          MinIOIcon
        </Grid>


        <Grid item xs={3} sm={2} md={1}>
          <cicons.BucketCopyIcon />
          <br />
          BucketCopyIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.UserPlusIcon />
          <br />
          UserPlusIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FolderPlusIcon />
          <br />
          FolderPlusIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.BucketIcon />
          <br />
          BucketIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.InfoIcon />
          <br />
          InfoIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.BucketIcon />
          <br />
          BucketIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.GlassesIcon />
          <br />
          GlassesIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.KeyRoundIcon />
          <br />
          KeyRoundIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.EyeIcon />
          <br />
          EyeIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.BookXIcon />
          <br />
          BookXIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.ArchiveRestoreIcon />
          <br />
          ArchiveRestoreIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.RedoIcon />
          <br />
          RedoIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.RefreshCWIcon />
          <br />
          RefreshCWIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.DeleteIcon />
          <br />
          DeleteIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.TrashIcon />
          <br />
          TrashIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.PieChartIcon />
          <br />
          PieChartIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.PieChartIcon />
          <br />
          PieChartIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.WineIcon />
          <br />
          WineIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FeatherIcon />
          <br />
          FeatherIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FeatherIcon />
          <br />
          FeatherIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.SearchIcon />
          <br />
          SearchIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.CheckCheckIcon />
          <br />
          CheckCheckIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.SquareStackIcon />
          <br />
          SquareStackIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.ServerIcon />
          <br />
          ServerIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.SquareUserRoundIcon />
          <br />
          SquareUserRoundIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.UserRoundCheckIcon />
          <br />
          UserRoundCheckIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.SquareUserIcon />
          <br />
          SquareUserIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.SettingsIcon />
          <br />
          SettingsIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.ShareIcon />
          <br />
          ShareIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.GaugeIcon />
          <br />
          GaugeIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.StarIcon />
          <br />
          StarIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.HardDriveIcon />
          <br />
          HardDriveIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.FolderSyncIcon />
          <br />
          FolderSyncIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.TagsIcon />
          <br />
          TagsIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.UsersRoundIcon />
          <br />
          UsersRoundIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.TiersNotAvailableIcon />
          <br />
          TiersNotAvailableIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.ToolsIcon />
          <br />
          ToolsIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.TotalObjectsIcon />
          <br />
          TotalObjectsIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.TraceIcon />
          <br />
          TraceIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.TrashIcon />
          <br />
          TrashIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.UploadFile />
          <br />
          UploadFile
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.UploadFolderIcon />
          <br />
          UploadFolderIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.UploadIcon />
          <br />
          UploadIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.UploadStatIcon />
          <br />
          UploadStatIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.UptimeIcon />
          <br />
          UptimeIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.UsersIcon />
          <br />
          UsersIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.VerifiedIcon />
          <br />
          VerifiedIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.VersionIcon />
          <br />
          VersionIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.VersionsIcon />
          <br />
          VersionsIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.CircleAlertIcon />
          <br />
          CircleAlertIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.WarpIcon />
          <br />
          WarpIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <cicons.WatchIcon />
          <br />
          WatchIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <cicons.AlertCloseIcon />
          <br />
          AlertCloseIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <cicons.OpenSourceIcon />
          <br />
          OpenSourceIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <cicons.LicenseDocIcon />
          <br />
          LicenseDocIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <cicons.BackIcon />
          <br />
          BackIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <cicons.FilterIcon />
          <br />
          FilterIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <cicons.SuccessIcon />
          <br />
          SuccessIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <cicons.NetworkGetIcon />
          <br />
          NetworkGetIcon
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <cicons.NetworkPutIcon />
          <br />
          NetworkPutIcon
        </Grid>
      </Grid>
      <h1>Menu Icons</h1>
      <Grid
        container
        sx={{
          fontSize: 12,
          wordWrap: "break-word",
          "& .min-loader": {
            width: 45,
            height: 45,
          },
          "& .min-icon": {
            color: color === "red" ? "red" : "black",
          },
        }}
      >
        <Grid item xs={3} sm={2} md={1}>
          <micons.AccessMenuIcon />
          <br />
          AccessMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.AccountsMenuIcon />
          <br />
          AccountsMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.AuditLogsMenuIcon />
          <br />
          AuditLogsMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.BucketsMenuIcon />
          <br />
          BucketsMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.CallHomeMenuIcon />
          <br />
          CallHomeMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.DiagnosticsMenuIcon />
          <br />
          DiagnosticsMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.DrivesMenuIcon />
          <br />
          DrivesMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.GroupsMenuIcon />
          <br />
          GroupsMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.HealthMenuIcon />
          <br />
          HealthMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.IdentityMenuIcon />
          <br />
          IdentityMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.InspectMenuIcon />
          <br />
          InspectMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.LogsMenuIcon />
          <br />
          LogsMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.MenuCollapsedIcon />
          <br />
          MenuCollapsedIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.MenuExpandedIcon />
          <br />
          MenuExpandedIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.MetricsMenuIcon />
          <br />
          MetricsMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.MonitoringMenuIcon />
          <br />
          MonitoringMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.PerformanceMenuIcon />
          <br />
          PerformanceMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.ProfileMenuIcon />
          <br />
          ProfileMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.RegisterMenuIcon />
          <br />
          RegisterMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.SupportMenuIcon />
          <br />
          SupportMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.TraceMenuIcon />
          <br />
          TraceMenuIcon
        </Grid>

        <Grid item xs={3} sm={2} md={1}>
          <micons.UsersMenuIcon />
          <br />
          UsersMenuIcon
        </Grid>
      </Grid>
    </Box>
  );
};

export default IconsScreen;
