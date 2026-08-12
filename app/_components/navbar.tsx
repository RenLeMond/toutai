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

  const aboutLink = (
    <Link href="/about">
      <Text
        variant="body-2"
        weight="medium"
        className="hover:text-primary hover:cursor-pointer"
      >
        关于
      </Text>
    </Link>
  );

  if (isWorldVersion) {
    return (
      <>
        <Hidden hide={{ s: true, m: false }}>
          <View direction="row" gap={5} align="center" as="nav">
            {aboutLink}
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
              <Link href="/about" className="block">
                <MenuItem roundedCorners>
                  <Text
                    variant="body-3"
                    className="hover:text-primary hover:cursor-pointer"
                  >
                    关于
                  </Text>
                </MenuItem>
              </Link>
            </Popover.Content>
          </Popover>
        </Hidden>
      </>
    );
  }

  return (
    <>
      <Hidden hide={{ s: true, m: false }}>
        <View direction="row" gap={5} align="center" as="nav">
          <Link href="/data">
            <Text
              variant="body-2"
              weight="medium"
              className="hover:text-primary hover:cursor-pointer"
            >
              数据来源
            </Text>
          </Link>
          <Link href="/probability">
            <Text
              variant="body-2"
              weight="medium"
              className="hover:text-primary hover:cursor-pointer"
            >
              概率计算器
            </Text>
          </Link>
          {aboutLink}
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
            <Link href="/data" className="block">
              <MenuItem roundedCorners>
                <Text
                  variant="body-3"
                  className="hover:text-primary hover:cursor-pointer"
                >
                  数据来源
                </Text>
              </MenuItem>
            </Link>
            <Link href="/probability" className="block">
              <MenuItem roundedCorners>
                <Text
                  variant="body-3"
                  className="hover:text-primary hover:cursor-pointer"
                >
                  概率计算器
                </Text>
              </MenuItem>
            </Link>
            <Link href="/about" className="block">
              <MenuItem roundedCorners>
                <Text
                  variant="body-3"
                  className="hover:text-primary hover:cursor-pointer"
                >
                  关于
                </Text>
              </MenuItem>
            </Link>
          </Popover.Content>
        </Popover>
      </Hidden>
    </>
  );
}

export default Navbar;
