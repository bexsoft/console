//  This file is part of MinIO Console Server
//  Copyright (c) 2022 MinIO, Inc.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Affero General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Affero General Public License for more details.
//
//  You should have received a copy of the GNU Affero General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

import { IMenuItem } from "./Menu/types";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES_PERMISSIONS,
} from "../../common/SecureComponent/permissions";

import { hasPermission } from "../../common/SecureComponent";

const permissionsValidation = (item: IMenuItem) => {
  return (
    ((item.customPermissionFnc
      ? item.customPermissionFnc()
      : hasPermission(
          CONSOLE_UI_RESOURCE,
          IAM_PAGES_PERMISSIONS[item.path ?? ""],
        )) ||
      item.forceDisplay) &&
    !item.fsHidden
  );
};

const validateItem = (item: IMenuItem) => {
  // We clean up child items first
  if (item.children && item.children.length > 0) {
    const childArray: IMenuItem[] = item.children.reduce(
      (acc: IMenuItem[], item) => {
        if (!validateItem(item)) {
          return [...acc];
        }

        return [...acc, item];
      },
      [],
    );

    return { ...item, children: childArray };
  }

  if (permissionsValidation(item)) {
    return item;
  }

  return false;
};
