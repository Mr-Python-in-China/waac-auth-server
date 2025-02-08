"use client";

import Link from "@/components/link";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useAuth } from "./authContext";
import { ReactNode } from "react";
import styled from "styled-components";
import {
  faHome,
  faRightFromBracket,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import userLogout from "../../app/auth/userLogout";

const NavTabs = [
  ["主页", "/", faHome],
  ["角色", "/profile", faUsers],
] as const satisfies [string, string, ...([IconDefinition] | [])][];

const HeaderLink = styled(Link)`
  background-color: transparent;
  align-items: center;
  border: 0;
  border-radius: var(--borderRadius-medium);
  color: var(--fgColor-default);
  cursor: pointer;
  display: flex;
  gap: 8px;
  line-height: 30px;
  padding: 0 var(--control-medium-paddingInline-condensed);
  text-align: center;
  text-decoration: none;
  font-size: var(--text-body-size-large);
  transition: background 0.12s ease-out;
  &:hover {
    background: var(--control-transparent-bgColor-hover);
  }
  &[aria-current="page"] {
    color: var(--fgColor-accent);
  }
`;

export function AppLayout({
  tab,
  children,
}: {
  tab?: (typeof NavTabs)[number][0];
  children: ReactNode;
}) {
  const user = useAuth();
  return (
    <>
      <header
        style={{
          color: "var(--fgColor-default)",
          background: "var(--bgColor-inset)",
          display: "flex",
          padding: "var(--base-size-12) var(--base-size-16)",
          gap: "var(--base-size-12)",
          fontSize: "var(--text-body-size-large)",
          borderBottom:
            "var(--borderWidth-thin) solid var(--borderColor-default)",
        }}
      >
        <nav style={{ flex: 1 }}>
          <ul
            style={{
              display: "flex",
              gap: "var(--control-medium-gap)",
              alignItems: "center",
              listStyleType: "none",
              padding: 0,
              margin: 0,
            }}
          >
            {NavTabs.map(([name, href, icon]) => (
              <li key={name}>
                <HeaderLink
                  href={href}
                  aria-current={name === tab ? "page" : undefined}
                >
                  {icon && <FontAwesomeIcon icon={icon} />}
                  {name}
                </HeaderLink>
              </li>
            ))}
          </ul>
        </nav>
        <div
          style={{
            display: "flex",
            gap: "var(--control-medium-gap)",
            alignItems: "center",
          }}
        >
          {user ? (
            <>
              <div>{user.username}</div>
              <HeaderLink as="button" onClick={() => userLogout()}>
                <FontAwesomeIcon icon={faRightFromBracket} />
                登出
              </HeaderLink>
            </>
          ) : (
            <>
              <HeaderLink href="/auth/login">登录</HeaderLink>
              <HeaderLink href="/auth/register">注册</HeaderLink>
            </>
          )}
        </div>
      </header>
      <main>{children}</main>
    </>
  );
}
