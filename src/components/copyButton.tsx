import { IconButton } from "@primer/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

export function CopyButton({ onCopy }: { onCopy: () => Promise<boolean> }) {
  const [flag, setFlag] = useState<NodeJS.Timeout | undefined>(undefined);
  return (
    <IconButton
      variant="invisible"
      aria-labelledby="复制"
      icon={
        flag
          ? () => <FontAwesomeIcon icon={faCheck} style={{ height: "16px" }} />
          : () => <FontAwesomeIcon icon={faCopy} style={{ height: "16px" }} />
      }
      style={flag && { color: "var(--fgColor-accent)" }}
      onClick={async () => {
        if (!(await onCopy())) return;
        if (flag) clearTimeout(flag);
        setFlag(setTimeout(() => setFlag(undefined), 1000));
      }}
    />
  );
}
