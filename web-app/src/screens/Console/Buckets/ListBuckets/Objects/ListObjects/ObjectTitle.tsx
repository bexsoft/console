import { useSelector } from "react-redux";
import { Box, BoxedIcon } from "mds";
import { useMDSTheme } from "mds";

import { displayFileIconName } from "./utils";
import { AppState } from "../../../../../../store";

const ObjectTitle = () => {
  const theme = useMDSTheme();

  const actualInfo = useSelector(
    (state: AppState) => state.objectBrowser.objectData.selectedObjectInfo,
  );

  if (actualInfo) {
    // calculate object name to display
    let objectNameArray: string[] = [];
    if (actualInfo && actualInfo.name) {
      objectNameArray = actualInfo.name.split("/");
    }

    const objectName =
      objectNameArray.length > 0
        ? objectNameArray[objectNameArray.length - 1]
        : actualInfo.name;

    return (
      <Box
        sx={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          "& .objTitleName": {
            overflowWrap: "break-word",
            boxSizing: "border-box",
            overflow: "hidden",
            color: theme.colors["Color/Neutral/Text/colorTextHeading"],
          },
        }}
      >
        <BoxedIcon>{displayFileIconName(objectName || "", true)}</BoxedIcon>
        <Box className={"objTitleName Base_Strong"}>{objectName}</Box>
      </Box>
    );
  }

  return null;
};

export default ObjectTitle;
