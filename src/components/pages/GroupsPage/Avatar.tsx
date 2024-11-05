import { GroupMemberSmall } from "./Components/SmallGroupCard";

type props = {
  member: GroupMemberSmall;
};

export default function Avatar({ member }: props) {
  return (
    <button type="button" className="p-0 border-0 bg-transparent">
      <img
        src={member.url}
        alt="Avatar"
        className="h-12 w-12 rounded-full object-cover"
      />
    </button>
  );
}
