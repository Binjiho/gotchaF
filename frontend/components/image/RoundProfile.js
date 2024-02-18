export default function RoundProfile({ img, size }) {
  return (
    <div
      className={`rounded-full overflow-hidden bg-gray1`}
      style={{ width: `${size}px`, height: `${size}px` }}>
      {img && <img src={img} alt="" className={`w-full h-full object-fit-cover`} />}
    </div>
  );
}
