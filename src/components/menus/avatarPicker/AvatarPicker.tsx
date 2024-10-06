import { gifList } from "@/assets/gifList";
import "./avatarPicker.css"

export function AvatarPicker() {
  return (
    <div className="avatar-picker box-shadow">
      {gifList.map((url) => (
        <AvatarSmall url={url} key={url} />
      ))}
    </div>
  );
}

type AvatarSmallProps = {
  url: string;
}

export function AvatarSmall({ url }: AvatarSmallProps) {
  return (
    <img src={url} alt=""
      style={{
        height: "45px",
        width: "45px",
        borderRadius: "50%",
      }}
    />
  );
}