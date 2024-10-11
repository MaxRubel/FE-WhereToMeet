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
      onClick={() => {
        sendSelection(url);
      }}
      type="button"
    >
      <img
        src={url}
        alt=""
        style={{
          height: "45px",
          width: "45px",
          borderRadius: "50%",
        }}
      />
    </button>
  );
}
