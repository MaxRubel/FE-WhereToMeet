import { LocationIcon } from "@/components/graphics/Graphics1";
import { Location } from "dataTypes";
import styles from "./styles.module.css";

type props = {
  location: Location;
};

export default function LocationCard({ location }: props) {
  const { street, city, state } = location.address;
  return (
    <div className="cool-card">
      <div className={styles.titleRow}>
        <LocationIcon size="20" />
        {location.name ? location.name : "No location has been added..."}
      </div>
      {street && (
        <div className={styles.address}>
          <div>
            {street} {city}, {state}
          </div>
        </div>
      )}
    </div>
  );
}
