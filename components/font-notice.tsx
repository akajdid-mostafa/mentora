// The notice that tells a buyer to fetch the Fontshare faces: the card itself is
// font-notice-card.tsx. It is imported here behind the development check
// rather than at the top of the file, so a production build drops the import
// with the branch, and neither the card's copy button nor the directory read
// behind it reaches the bundle every page loads or the server's file trace.
export async function FontNotice() {
  if (process.env.NODE_ENV !== "development") return null;
  const { FontNoticeCard } = await import("@/components/font-notice-card");
  return <FontNoticeCard />;
}
