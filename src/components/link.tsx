import { Link as UILink } from "@primer/react";
import NextLink from "next/link";

export default function Link({
  href,
  ...rest
}: { href: string } & Omit<Parameters<typeof UILink>[0], "href">) {
  return (
    <NextLink href={href} passHref legacyBehavior>
      <UILink {...rest} />
    </NextLink>
  );
}
