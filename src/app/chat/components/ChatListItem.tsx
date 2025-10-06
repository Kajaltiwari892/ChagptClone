export default function ChatListItem({
  title,
  collapsed,
  onClick,
}: {
  title: string;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-white/6 ${
        collapsed ? "justify-center" : ""
      }`}
      onClick={onClick}
    >
      {!collapsed && <div className="text-sm">{title}</div>}
    </div>
  );
}
