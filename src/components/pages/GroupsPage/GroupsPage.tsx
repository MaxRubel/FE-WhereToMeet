import { useEffect, useState } from "react";
import "./GroupsPage.css"
import { CreateGroup, GroupIcon } from "@/components/graphics/Graphics1";
import GroupForm from "@/components/pages/GroupsPage/CreateGroup/GroupForm";
import ViewGroups from "./ViewGroups/ViewGroups";
import { useParams } from "react-router-dom";
import ViewSingleGroup from "./ViewSingleGroup/ViewSingleGroup";

export default function GroupsPage() {
  const [isViewing, setIsViewing] = useState("ViewGroups");
  const [viewSingleId, setViewSingleId] = useState<null | string>(null)
  const { groupId } = useParams();

  useEffect(() => {
    if (groupId) {
      setIsViewing("ViewSingleGroup")
      setViewSingleId(groupId)
    };
  }, [groupId])


  return (
    <div className="profile-page-layout">
      <div className="profile-side-bar">
        <ul className="profile-list">
          <button
            className="clear-button side-list-item"
            style={{
              fontWeight: isViewing == "ViewGroups" ? "900" : "",
              backgroundColor:
                isViewing == "ViewGroups"
                  ? "rgb(245,245,245)"
                  : "transparent",
            }}
            onClick={() => {
              setIsViewing("ViewGroups");
            }}
          >
            <GroupIcon size="18" />
            View Groups
          </button>

          <button
            className="side-list-item"
            style={{
              fontWeight: isViewing == "CreateGroupForm" ? "900" : "",
              backgroundColor:
                isViewing == "CreateGroupForm"
                  ? "rgb(245,245,245)"
                  : "transparent",
            }}
            onClick={() => {
              setIsViewing("CreateGroupForm");
            }}
          >
            <CreateGroup size="18" />
            Create Group
          </button>

        </ul>
      </div>
      <div className="profile-main-form">
        {isViewing == "ViewGroups" && <ViewGroups />}
        {isViewing == "CreateGroupForm" && <GroupForm />}

        {/* @ts-expect-error -- groupId is already null checked */}
        {isViewing == "ViewSingleGroup" && <ViewSingleGroup groupId={viewSingleId} />}
      </div>
    </div>
  );
}
