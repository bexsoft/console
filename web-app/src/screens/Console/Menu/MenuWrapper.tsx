// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
import { useSelector } from "react-redux";
import { AppState, useAppDispatch } from "../../../store";
import { validRoutes } from "../valid-routes";
//import { menuOpen } from "../../../systemSlice";
import { selFeatures } from "../consoleSlice";
import {
  getLogoApplicationVariant,
  getLogoVar,
  registeredCluster,
} from "../../../config";
import { useLocation, useNavigate } from "react-router-dom";
import { getLicenseConsent } from "../License/utils";
import TopBar from "./TopBar";
import { Box, Breadcrumbs, LogOutIcon, ThemedLogo } from "mds";
import ObjectManagerButton from "../Common/ObjectManager/ObjectManagerButton";
import HelpMenu from "../HelpMenu";
import TopNavigatorButton from "./TopNavigationButton";
import DarkModeActivator from "../Common/DarkModeActivator/DarkModeActivator";

const MenuWrapper = () => {
  const dispatch = useAppDispatch();
  const features = useSelector(selFeatures);
  const navigate = useNavigate();
  const { pathname = "" } = useLocation();

  const sidebarOpen = useSelector(
    (state: AppState) => state.system.sidebarOpen,
  );
  const licenseInfo = useSelector(
    (state: AppState) => state?.system?.licenseInfo,
  );

  const isAgplAckDone = getLicenseConsent();
  const clusterRegistered = registeredCluster();

  const { plan = "" } = licenseInfo || {};

  let licenseNotification = true;
  if (plan || isAgplAckDone || clusterRegistered) {
    licenseNotification = false;
  }

  const allowedMenuItems = validRoutes(features, licenseNotification);

  /*return (
    <Menu
      isOpen={sidebarOpen}
      displayGroupTitles
      options={allowedMenuItems}
      applicationLogo={{
        applicationName: getLogoApplicationVariant(),
        subVariant: getLogoVar(),
      }}
      callPathAction={(path) => {
        navigate(path);
      }}
      signOutAction={() => {

      }}
      collapseAction={() => {
        dispatch(menuOpen(!sidebarOpen));
      }}
      currentPath={pathname}
      mobileModeAuto={false}
    />
  );*/

  return <TopBar>
    <Box sx={{ flexGrow: 1, "& svg": {width: 56}, }}>
      <ThemedLogo />
    </Box>
    <HelpMenu />
    <ObjectManagerButton />
    {/*isK8s && <MainDropOptions />*/}
    <DarkModeActivator />
    <TopNavigatorButton id={"sign-out"} onClick={() => navigate("/logout")}>
      <LogOutIcon style={{ width: 16, marginLeft: 0 }} />
    </TopNavigatorButton>
  </TopBar>;
};

export default MenuWrapper;
