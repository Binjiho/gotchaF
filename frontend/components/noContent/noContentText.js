export default function NoContentText({ title, className = "" }) {
  return (
    <div className={`p-[14px] border !border-gray3 rounded-[3px] ${className}`}>
      <strong className={`text-[15px] font-medium`}>{title}</strong>
    </div>
  );
}
