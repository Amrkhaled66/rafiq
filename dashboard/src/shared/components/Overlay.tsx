
import clsx from 'clsx';
const Overlay = ({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) => {

  if (!isOpen) return null;
  return (
    <div
      className={clsx("fixed inset-0 z-80 bg-black/50")}
      onClick={onClick}
    />
  );
};

export default Overlay;
