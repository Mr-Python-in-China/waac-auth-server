import { IconButton } from "@primer/react";
import { CheckIcon, CopyIcon } from "@primer/octicons-react";
import { useState } from "react";

export function CopyButton({ onCopy }: { onCopy: () => Promise<boolean> }) {
  const [flag, setFlag] = useState<NodeJS.Timeout | undefined>(undefined);
  return (
    <IconButton
      variant="invisible"
      aria-labelledby="复制"
      icon={flag ? CheckIcon : CopyIcon}
      style={flag && { color: "var(--fgColor-accent)" }}
      onClick={async () => {
        if (!(await onCopy())) return;
        if (flag) clearTimeout(flag);
        setFlag(setTimeout(() => setFlag(undefined), 1000));
      }}
    />
  );
}
