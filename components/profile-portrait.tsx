export function ProfilePortrait({ name }: { name: string }) {
  return <figure
    className="profile-portrait"
    tabIndex={0}
    aria-label="杨弋南个人水彩肖像，悬停或聚焦增强色彩"
  >
    {/* The watercolor edge is intentionally left unframed so the portrait blends into the hero. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/profile/yang-yinan.jpg" alt="杨弋南水彩钢笔肖像" draggable={false} />
    <figcaption aria-hidden="true">{name}</figcaption>
  </figure>;
}
