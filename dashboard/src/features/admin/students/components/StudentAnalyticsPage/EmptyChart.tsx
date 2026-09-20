import { Icon } from "@iconify/react";

export default function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-center">
      <Icon icon="solar:chart-square-linear" className="text-subTitle size-12" />
      <p className="text-subTitle text-sm">{message}</p>
    </div>
  );
}
