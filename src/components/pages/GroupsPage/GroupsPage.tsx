import { useEffect, useState } from "react";
import "./GroupsPage.css"
import { AddSymbol, ViewFolders } from "@/components/graphics/Graphics1";
import ViewGroups from "./ViewGroups/ViewGroups";
import { useNavigate, useParams } from "react-router-dom";
import ViewSingleGroup from "./ViewSingleGroup/ViewSingleGroup";
import CreateGroupForm from "./CreateGroup/CreateGroupForm";

export default function GroupsPage() {
  const [isViewing, setIsViewing] = useState("ViewGroups");
  const [viewSingleId, setViewSingleId] = useState<null | string>(null)
  const { groupId } = useParams();
  const navigate = useNavigate();

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
            <AddSymbol size="18" />
            Create Group
          </button>

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
              navigate('/groups')
            }}
          >
            <ViewFolders size="18" />
            View Groups
          </button>

        </ul>
      </div>
      <div className="profile-main-form">
        {isViewing == "ViewGroups" && <ViewGroups />}
        {isViewing == "CreateGroupForm" && <CreateGroupForm />}
        {/* @ts-expect-error -- groupId is already null checked */}
        {isViewing == "ViewSingleGroup" && <ViewSingleGroup groupId={viewSingleId} setIsViewing={setIsViewing} />}
      </div>
    </div>
  );
}
