export default function Layout({ children }) {
  return (
    <>
      <div className={`min-h-full max-w-[500px] mx-auto my-0 bg-white`}>
        <div className={`min-h-[100vh]`}>{children}</div>
      </div>
    </>
  );
}
