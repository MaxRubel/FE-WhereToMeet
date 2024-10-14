import { Skeleton } from "@/components/ui/skeleton";
import styles from "./GroupStyles.module.css"

export default function SmallGroupSkele() {

  return (
    <div style={{
      padding: "1em",
      marginBottom: "2em",
      border: "1px solid rgb(240, 240, 240)",
      borderRadius: "10px"
    }}>
      <div style={{ marginBottom: "1em" }}>
        <Skeleton className="w-[200px] h-[30px] " />
      </div>
      <div className={styles.skeleMembers}>
        <Skeleton className="w-[40px] h-[40px] rounded-full" />
        <Skeleton className="w-[40px] h-[40px] rounded-full" />
        <Skeleton className="w-[40px] h-[40px] rounded-full" />
        <Skeleton className="w-[40px] h-[40px] rounded-full" />
        <Skeleton className="w-[40px] h-[40px] rounded-full" />
        <Skeleton className="w-[40px] h-[40px] rounded-full" />
      </div>
      <div style={{ marginTop: "1em" }}>
        <Skeleton className="w-[100px] h-[45px] " />
      </div>
    </div>
  )

}