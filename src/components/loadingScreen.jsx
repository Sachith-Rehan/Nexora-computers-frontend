export default function LoadingScreen() {
  return (
    <div
      role="status"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <span
        aria-hidden="true"
        className="size-[100px] rounded-full border-[3px] border-white border-t-transparent motion-safe:animate-spin"
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
