import { Skeleton } from "@/components/ui/skeleton";

export default function GroupSkelly() {
  return (
    <div>
      <Skeleton
        style={{ marginBottom: '.2em' }}
        className="w-[250px] h-[40px] rounded-full bottom-4" />
      <Skeleton
        style={{ marginBottom: '3em' }}
        className="w-[380px] h-[20px] rounded-full" />
      <Skeleton
        style={{ marginBottom: '4em' }}
        className="w-[380px] h-[220px] " />
      <div style={{ display: 'flex', gap: '1em' }}>
        <Skeleton
          style={{ marginBottom: '1em' }}
          className="w-[100px] h-[44px] " />
        <Skeleton
          style={{ marginBottom: '4em' }}
          className="w-[100px] h-[44px] " />
      </div>
      <Skeleton
        style={{ marginBottom: '1em' }}
        className="w-[100px] h-[44px] " />
    </div>
  )
}