'use client';

import React from 'react';
import { View, Text, Popover, Button, Icon, Hidden, MenuItem } from 'reshaped';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { resolveAppVersion, useAppVersion } from '@/lib/store/useAppVersion';

function Navbar() {
  const pathname = usePathname();
  const storedVersion = useAppVersion(state => state.version);
  const activeVersion = resolveAppVersion(pathname, storedVersion);
  const isWorldVersion = activeVersion === 'world';
  const isDynastyVersion = activeVersion === 'dynasty';

  const dataHref = isWorldVersion
    ? '/world/data'
    : isDynastyVersion
      ? '/dynasty/data'
      : '/data';
  const probabilityHref = isWorldVersion
    ? '/world/probability'
    : isDynastyVersion
      ? '/dynasty/probability'
      : '/probability';
  const aboutHref = isWorldVersion
    ? '/world/about'
    : isDynastyVersion
      ? '/dynasty/about'
      : '/about';

  const navLink = (href: string, label: string) => (
    <Link key={href} href={href}>
      <Text
        variant="body-2"
        weight="medium"
        className="hover:text-primary hover:cursor-pointer"
      >
        {label}
      </Text>
    </Link>
  );

  const menuItem = (href: string, label: string) => (
    <Link href={href} className="block">
      <MenuItem roundedCorners>
        <Text
          variant="body-3"
          className="hover:text-primary hover:cursor-pointer"
        >
          {label}
        </Text>
      </MenuItem>
    </Link>
  );

  return (
    <>
      <Hidden hide={{ s: true, m: false }}>
        <View direction="row" gap={5} align="center" as="nav">
          {navLink(dataHref, '数据来源')}
          {navLink(probabilityHref, '概率计算器')}
          {navLink(aboutHref, '关于')}
        </View>
      </Hidden>
      <Hidden hide={{ s: false, m: true }}>
        <Popover position="bottom-end" padding={1} width="140px">
          <Popover.Trigger>
            {attributes => (
              <Button
                attributes={attributes}
                icon={<Icon size={4} svg={<Menu />} />}
              />
            )}
          </Popover.Trigger>
          <Popover.Content>
            {menuItem(dataHref, '数据来源')}
            {menuItem(probabilityHref, '概率计算器')}
            {menuItem(aboutHref, '关于')}
          </Popover.Content>
        </Popover>
      </Hidden>
    </>
  );
}

export default Navbar;
