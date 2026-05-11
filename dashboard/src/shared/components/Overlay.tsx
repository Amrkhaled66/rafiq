
const Overlay = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 lg:pointer-events-none lg:hidden"
      onClick={onClick}
    />
  );
};

export default Overlay;
