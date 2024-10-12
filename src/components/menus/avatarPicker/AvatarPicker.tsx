import { gifList } from "@/assets/gifList";
import "./avatarPicker.css";

type AvatarPicker = {
  sendSelection: Function;
};

export function AvatarPicker({ sendSelection }: AvatarPicker) {
  return (
    <div className="avatar-picker box-shadow" style={{ marginTop: "1em" }}>
      {gifList.map((url) => (
        <AvatarSmall url={url} key={url} sendSelection={sendSelection} />
      ))}
    </div>
  );
}

type AvatarSmallProps = {
  url: string;
  sendSelection: Function;
};

export function AvatarSmall({ url, sendSelection }: AvatarSmallProps) {

  return (
    <button
      onClick={() => sendSelection(url)}
      type="button"
      className="p-0 border-0 bg-transparent"
    >
      <img
        src={url}
        alt="Avatar"
        className="h-12 w-12 rounded-full object-cover"
      />
    </button>
  );
}
