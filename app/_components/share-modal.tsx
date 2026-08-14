'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button, Dismissible, Icon, Loader, Modal, Tabs, Text, View } from 'reshaped';
import useShareModal, { ShareInfo } from '@/lib/store/useShareModal';
import html2canvas from 'html2canvas';
import { CarrotIcon } from '@/components/title';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import ChinaMap from '@/components/icon';
import { translateGenderChild } from '@/lib/rebirth';
import { formatWorldProbability } from '@/lib/world-rebirth';
import DynastySharePoster from '@/components/dynasty-share-poster';
import { generateDynastyShareBlob } from '@/lib/dynasty-share-canvas';

const ShareMap = dynamic(() => import('@/components/share-map'), {
  ssr: false,
  loading: () => (
    <View
      direction="row"
      gap={2}
      align="center"
      justify="center"
      height={40}
      width="100%"
    >
      <Loader />
      <Text>地图加载中</Text>
    </View>
  )
});

const ShareWorldMap = dynamic(() => import('@/components/share-world-map'), {
  ssr: false,
  loading: () => (
    <View
      direction="row"
      gap={2}
      align="center"
      justify="center"
      height={40}
      width="100%"
    >
      <Loader />
      <Text>地图加载中</Text>
    </View>
  )
});

const WORLD_SHARE_URL = 'https://toutai.online/world';

function WorldShareQr({ bgColor }: { bgColor: string }) {
  return (
    <QRCode
      value={WORLD_SHARE_URL}
      bgColor={bgColor}
      fgColor="#000000"
      level="L"
      size={256}
      className="w-12 h-12"
    />
  );
}

function WorldShareFooter({ bgColor }: { bgColor: string }) {
  return (
    <View direction="row" justify="space-between" align="center">
      <View direction="row" gap={2} align="center">
        <CarrotIcon size={40} />
        <View direction="column">
          <Text color="primary" weight="medium" variant="body-1">
            投胎模拟器
          </Text>
          <Text color="primary" weight="medium">
            toutai.online/world
          </Text>
        </View>
      </View>
      <WorldShareQr bgColor={bgColor} />
    </View>
  );
}

function WorldShareStyle1({ shareInfo }: { shareInfo: ShareInfo }) {
  return (
    <div
      className="w-full bg-orange-200 relative aspect-square"
      id="shareContent"
    >
      <View
        direction="column"
        padding={6}
        justify="space-between"
        height="100%"
      >
        {shareInfo.position && (
          <ShareWorldMap
            position={shareInfo.position}
            countryEn={shareInfo.countryEn}
          />
        )}
        <Text variant="body-2" weight="medium">
          我在投胎模拟器世界版第{' '}
          <span className="text-[#ba3700] font-medium">{shareInfo.count}</span>{' '}
          次投胎在
          <span className="text-[#ba3700] font-medium">{shareInfo.region}</span>
          （
          <span className="text-[#ba3700] font-medium">
            {shareInfo.continent}
          </span>
          ），概率只有{' '}
          <span className="text-[#ba3700] font-medium">
            {formatWorldProbability(shareInfo.probability)}
          </span>
          ，你也来试试吧！
        </Text>
        <WorldShareFooter bgColor="#fed8aa" />
      </View>
    </div>
  );
}

function WorldShareStyle2({ shareInfo }: { shareInfo: ShareInfo }) {
  return (
    <div
      className="w-full bg-[#f5f3ef] relative aspect-square"
      id="shareContent"
    >
      <View direction="column" padding={6} height="100%">
        {shareInfo.position && (
          <div className="absolute right-0 top-8 w-44 h-32 opacity-25 pointer-events-none overflow-hidden rounded-xl">
            <ShareWorldMap
              position={shareInfo.position}
              countryEn={shareInfo.countryEn}
            />
          </div>
        )}
        <View direction="column" justify="center" grow paddingTop={6}>
          <Text variant="body-2" weight="medium" className="z-10">
            第{' '}
            <span className="text-[#ba3700] font-medium">{shareInfo.count}</span>{' '}
            次
          </Text>
          <Text variant="body-2" weight="medium" className="z-10">
            我投胎在了
            <span className="text-[#ba3700] font-medium">{shareInfo.region}</span>
          </Text>
          <Text variant="body-2" weight="medium" className="z-10">
            大洲
            <span className="text-[#ba3700] font-medium">
              {shareInfo.continent}
            </span>
          </Text>
          <Text variant="body-2" weight="medium" className="z-10">
            概率只有{' '}
            <span className="text-[#ba3700] font-medium">
              {formatWorldProbability(shareInfo.probability)}
            </span>
          </Text>
        </View>
        <WorldShareFooter bgColor="#f5f3ef" />
      </View>
    </div>
  );
}

function WorldShareStyle3({ shareInfo }: { shareInfo: ShareInfo }) {
  return (
    <div
      className="w-full bg-[#f5f3ef] relative aspect-square"
      id="shareContent"
    >
      <View
        direction="column"
        padding={6}
        height="100%"
        justify="space-between"
      >
        {shareInfo.position && (
          <ShareWorldMap
            position={shareInfo.position}
            countryEn={shareInfo.countryEn}
          />
        )}
        <View direction="row" justify="space-between" paddingBottom={4}>
          <View direction="column">
            <Text variant="body-2" weight="medium" className="z-10">
              第{' '}
              <span className="text-[#ba3700] font-medium">
                {shareInfo.count}
              </span>{' '}
              次
            </Text>
            <Text variant="body-2" weight="medium" className="z-10">
              我投胎在了
              <span className="text-[#ba3700] font-medium">
                {shareInfo.region}
              </span>
            </Text>
            <Text variant="body-2" weight="medium" className="z-10">
              大洲
              <span className="text-[#ba3700] font-medium">
                {shareInfo.continent}
              </span>
            </Text>
            <Text variant="body-2" weight="medium" className="z-10">
              概率只有{' '}
              <span className="text-[#ba3700] font-medium">
                {formatWorldProbability(shareInfo.probability)}
              </span>
            </Text>
          </View>
          <View justify="end" height="100%">
            <Text color="neutral-faded">#投胎 #重开</Text>
          </View>
        </View>
        <WorldShareFooter bgColor="#f5f3ef" />
      </View>
    </div>
  );
}

function ShareStyle1({ shareInfo }: { shareInfo: ShareInfo }) {
  return (
    <div
      className="w-full bg-orange-200 relative aspect-square"
      id="shareContent"
    >
      <View
        direction="column"
        padding={6}
        justify="space-between"
        height="100%"
      >
        <ShareMap region={shareInfo.region} />
        <Text variant="body-2" weight="medium">
          {['香港', '澳门', '台湾'].includes(shareInfo.region) ? (
            <>
              我在投胎模拟器第{' '}
              <span className="text-[#ba3700] font-medium">
                {shareInfo.count}
              </span>{' '}
              次投胎在
              <span className="text-[#ba3700] font-medium">
                {shareInfo.region}
              </span>
              ，是一个
              <span className="text-[#ba3700] font-medium">
                {translateGenderChild(shareInfo.gender)}
              </span>
              ，你也来试试吧！
            </>
          ) : (
            <>
              我在投胎模拟器第{' '}
              <span className="text-[#ba3700] font-medium">
                {shareInfo.count}
              </span>{' '}
              次投胎在
              <span className="text-[#ba3700] font-medium">
                {shareInfo.region}的{shareInfo.category}
              </span>
              ，是家里
              <span className="text-[#ba3700] font-medium">
                第{shareInfo.order}个{translateGenderChild(shareInfo.gender)}
              </span>
              ，概率只有{' '}
              <span className="text-[#ba3700] font-medium">
                {shareInfo.probability.toPrecision(2)}%
              </span>
              ，你也来试试吧！
            </>
          )}
        </Text>
        <View direction="row" justify="space-between" align="center">
          <View direction="row" gap={2} align="center">
            <CarrotIcon size={40} />
            <View direction="column">
              <Text color="primary" weight="medium" variant="body-1">
                投胎模拟器
              </Text>
              <Text color="primary" weight="medium">
                toutai.online
              </Text>
            </View>
          </View>
          <QRCode
            value="https://toutai.online"
            bgColor="#fed8aa"
            fgColor="#000000"
            level="L"
            size={256}
            className="w-12 h-12"
          />
        </View>
      </View>
    </div>
  );
}

function ShareStyle2({ shareInfo }: { shareInfo: ShareInfo }) {
  return (
    <div
      className="w-full bg-[#f5f3ef] relative aspect-square"
      id="shareContent"
    >
      <View direction="column" padding={6} height="100%">
        <div className="absolute right-2 top-12">
          <ChinaMap size={180} />
        </div>
        <View direction="column" justify="center" grow paddingTop={6}>
          {['香港', '澳门', '台湾'].includes(shareInfo.region) ? (
            <>
              <Text variant="body-2" weight="medium" className="z-10">
                第{' '}
                <span className="text-[#ba3700] font-medium">
                  {shareInfo.count}
                </span>{' '}
                次
              </Text>
              <Text variant="body-2" weight="medium" className="z-10">
                我投胎在了
                <span className="text-[#ba3700] font-medium">
                  {shareInfo.region}
                </span>
              </Text>
              <Text variant="body-2" weight="medium" className="z-10">
                是一个
                <span className="text-[#ba3700] font-medium">
                  {translateGenderChild(shareInfo.gender)}
                </span>
              </Text>
              <Text variant="body-2" weight="medium" className="z-10">
                概率只有{' '}
                <span className="text-[#ba3700] font-medium">
                  {shareInfo.probability.toPrecision(2)}%
                </span>
              </Text>
            </>
          ) : (
            <>
              <Text variant="body-2" weight="medium" className="z-10">
                第{' '}
                <span className="text-[#ba3700] font-medium">
                  {shareInfo.count}
                </span>{' '}
                次
              </Text>
              <Text variant="body-2" weight="medium" className="z-10">
                我投胎在了
                <span className="text-[#ba3700] font-medium">
                  {shareInfo.region}的{shareInfo.category}
                </span>
              </Text>
              <Text variant="body-2" weight="medium" className="z-10">
                是家里
                <span className="text-[#ba3700] font-medium">
                  第{shareInfo.order}个{translateGenderChild(shareInfo.gender)}
                </span>
              </Text>
              <Text variant="body-2" weight="medium" className="z-10">
                概率只有{' '}
                <span className="text-[#ba3700] font-medium">
                  {shareInfo.probability.toPrecision(2)}%
                </span>
              </Text>
            </>
          )}
        </View>
        <View direction="row" justify="space-between" align="center">
          <View direction="row" gap={2} align="center">
            <CarrotIcon size={40} />
            <View direction="column">
              <Text color="primary" weight="medium" variant="body-1">
                投胎模拟器
              </Text>
              <Text color="primary" weight="medium">
                toutai.online
              </Text>
            </View>
          </View>
          <QRCode
            value="https://toutai.online"
            bgColor="#f5f3ef"
            fgColor="#000000"
            level="L"
            size={256}
            className="w-12 h-12"
          />
        </View>
      </View>
    </div>
  );
}

function ShareStyle3({ shareInfo }: { shareInfo: ShareInfo }) {
  return (
    <div
      className="w-full bg-[#f5f3ef] relative aspect-square"
      id="shareContent"
    >
      <View
        direction="column"
        padding={6}
        height="100%"
        justify="space-between"
      >
        <ShareMap region={shareInfo.region} />
        <View direction="row" justify="space-between" paddingBottom={4}>
          <View direction="column">
            {['香港', '澳门', '台湾'].includes(shareInfo.region) ? (
              <>
                <Text variant="body-2" weight="medium" className="z-10">
                  第{' '}
                  <span className="text-[#ba3700] font-medium">
                    {shareInfo.count}
                  </span>{' '}
                  次
                </Text>
                <Text variant="body-2" weight="medium" className="z-10">
                  我投胎在了
                  <span className="text-[#ba3700] font-medium">
                    {shareInfo.region}
                  </span>
                </Text>
                <Text variant="body-2" weight="medium" className="z-10">
                  是一个
                  <span className="text-[#ba3700] font-medium">
                    {translateGenderChild(shareInfo.gender)}
                  </span>
                </Text>
                <Text variant="body-2" weight="medium" className="z-10">
                  概率只有{' '}
                  <span className="text-[#ba3700] font-medium">
                    {shareInfo.probability.toPrecision(2)}%
                  </span>
                </Text>
              </>
            ) : (
              <>
                <Text variant="body-2" weight="medium" className="z-10">
                  第{' '}
                  <span className="text-[#ba3700] font-medium">
                    {shareInfo.count}
                  </span>{' '}
                  次
                </Text>
                <Text variant="body-2" weight="medium" className="z-10">
                  我投胎在了
                  <span className="text-[#ba3700] font-medium">
                    {shareInfo.region}的{shareInfo.category}
                  </span>
                </Text>
                <Text variant="body-2" weight="medium" className="z-10">
                  是家里
                  <span className="text-[#ba3700] font-medium">
                    第{shareInfo.order}个
                    {translateGenderChild(shareInfo.gender)}
                  </span>
                </Text>
                <Text variant="body-2" weight="medium" className="z-10">
                  概率只有{' '}
                  <span className="text-[#ba3700] font-medium">
                    {shareInfo.probability.toPrecision(2)}%
                  </span>
                </Text>
              </>
            )}
          </View>
          <View justify="end" height="100%">
            <Text color="neutral-faded">#投胎 #重开</Text>
          </View>
        </View>
        <View direction="row" justify="space-between" align="center">
          <View direction="row" gap={2} align="center">
            <CarrotIcon size={40} />
            <View direction="column">
              <Text color="primary" weight="medium" variant="body-1">
                投胎模拟器
              </Text>
              <Text color="primary" weight="medium">
                toutai.online
              </Text>
            </View>
          </View>
          <QRCode
            value="https://toutai.online"
            bgColor="#f5f3ef"
            fgColor="#000000"
            level="L"
            size={256}
            className="w-12 h-12"
          />
        </View>
      </View>
    </div>
  );
}

function ModalFooter({
  onCancel,
  onSave,
  isSaving
}: {
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
}) {
  return (
    <View gap={2} direction="row">
      <View.Item key="cancel" columns={6}>
        <Button
          color="primary"
          variant="faded"
          fullWidth
          onClick={onCancel}
          disabled={isSaving}
        >
          取消
        </Button>
      </View.Item>
      <View.Item key="save" columns={6}>
        <Button
          color="primary"
          variant="solid"
          fullWidth
          onClick={onSave}
          disabled={isSaving}
          loading={isSaving}
        >
          {isSaving ? '生成中...' : '保存图片'}
        </Button>
      </View.Item>
    </View>
  );
}

async function waitForShareMapReady(root: HTMLElement, timeoutMs = 2500) {
  await new Promise(resolve =>
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  );
  if (root.querySelector('canvas')) return;
  if (!root.textContent?.includes('地图加载中')) return;

  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (root.querySelector('canvas')) return;
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

async function waitForShareImages(root: HTMLElement, timeoutMs = 3000) {
  const images = Array.from(root.querySelectorAll('img'));
  if (images.length === 0) return;

  await Promise.all(
    images.map(img => {
      if (img.complete && img.naturalWidth > 0) {
        return img.decode?.().catch(() => undefined) ?? Promise.resolve();
      }

      return new Promise<void>(resolve => {
        let settled = false;
        const done = () => {
          if (settled) return;
          settled = true;
          resolve();
        };

        const timer = window.setTimeout(done, timeoutMs);
        img.addEventListener(
          'load',
          () => {
            window.clearTimeout(timer);
            img.decode?.().then(done).catch(done);
          },
          { once: true }
        );
        img.addEventListener(
          'error',
          () => {
            window.clearTimeout(timer);
            done();
          },
          { once: true }
        );
      });
    })
  );
}

function ShareModal() {
  const { active, deactivate, shareInfo } = useShareModal();
  const [isSaving, setIsSaving] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const handleClose = () => {
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
      setPreviewImageUrl(null);
    }
    deactivate();
  };

  const handleClosePreview = () => {
    if (previewImageUrl) {
      URL.revokeObjectURL(previewImageUrl);
      setPreviewImageUrl(null);
    }
  };

  async function handleSaveAsImage() {
    if (isSaving) return;
    const shareContent = document.getElementById('shareContent');
    if (!shareContent && shareInfo.mode !== 'dynasty') return;

    setIsSaving(true);

    try {
      let blob: Blob | null = null;
      const filename =
        shareInfo.mode === 'dynasty'
          ? `投胎模拟器-王朝版-第${shareInfo.count}次.png`
          : `投胎模拟器-第${shareInfo.count}次.png`;

      if (shareInfo.mode === 'dynasty') {
        blob = await generateDynastyShareBlob(shareInfo);
      } else if (shareContent) {
        await waitForShareMapReady(shareContent);
        await waitForShareImages(shareContent);
        await new Promise<void>(resolve =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        );

        const canvas = await html2canvas(shareContent, {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          onclone(doc, cloned) {
            const target = doc.getElementById('shareContent') || cloned;
            target.querySelectorAll<HTMLElement>('*').forEach(el => {
              const display = el.style.display || getComputedStyle(el).display;
              const clamp =
                el.style.webkitLineClamp || getComputedStyle(el).webkitLineClamp;
              if (
                display.includes('-webkit-box') ||
                (clamp && clamp !== 'none')
              ) {
                el.style.display = 'block';
                el.style.setProperty('-webkit-line-clamp', 'unset');
                el.style.overflow = 'visible';
              }
            });
          }
        });

        blob = await new Promise<Blob | null>(resolve =>
          canvas.toBlob(resolve, 'image/png')
        );
      }

      if (!blob) {
        throw new Error('Failed to generate image blob');
      }

      const isMobile =
        typeof window !== 'undefined' &&
        (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) ||
          window.matchMedia('(max-width: 768px)').matches);

      const isWeChat =
        typeof window !== 'undefined' &&
        /MicroMessenger/i.test(navigator.userAgent);

      // 1. On mobile browsers (non-WeChat), try Web Share API for direct native "Save Image" option
      if (
        isMobile &&
        !isWeChat &&
        typeof navigator !== 'undefined' &&
        typeof File !== 'undefined'
      ) {
        try {
          const file = new File([blob], filename, { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: '投胎模拟器结果'
            });
            return;
          }
        } catch (err: unknown) {
          if (err instanceof Error && err.name === 'AbortError') {
            return;
          }
          console.warn('navigator.share failed, falling back to preview:', err);
        }
      }

      // 2. On mobile (WeChat or navigator.share fallback), display preview for long-press saving
      if (isMobile) {
        const blobUrl = URL.createObjectURL(blob);
        setPreviewImageUrl(blobUrl);
        return;
      }

      // 3. On desktop, trigger standard download
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = filename;
      link.href = blobUrl;
      link.click();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

      toast.custom(t => (
        <div className="relative bg-green-100 w-full sm:w-[354px] p-5 border-green-500 border rounded-xl">
          <div className="flex flex-row justify-between">
            <Text color="positive">图片已保存！</Text>
          </div>
          <button
            className="absolute top-2 right-3"
            onClick={() => toast.dismiss(t)}
          >
            <Icon color="positive" size={4} svg={<X />} />
          </button>
        </div>
      ));
    } catch (err) {
      console.error('Error capturing image:', err);
      toast.custom(t => (
        <div className="relative bg-red-100 w-full sm:w-[354px] p-5 border-red-500 border rounded-xl">
          <div className="flex flex-row justify-between">
            <Text color="critical">图片生成失败，请重试</Text>
          </div>
          <button
            className="absolute top-2 right-3"
            onClick={() => toast.dismiss(t)}
          >
            <Icon color="critical" size={4} svg={<X />} />
          </button>
        </div>
      ));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal active={active} onClose={handleClose}>
      {previewImageUrl ? (
        <View gap={3} align="center">
          <Dismissible onClose={handleClosePreview} closeAriaLabel="关闭预览">
            <Modal.Title>长按保存图片</Modal.Title>
            <Modal.Subtitle>
              长按下方图片，在弹出菜单中选择「保存到相册」
            </Modal.Subtitle>
          </Dismissible>
          <div
            style={{
              maxWidth: '100%',
              maxHeight: '62vh',
              overflowY: 'auto',
              borderRadius: 14,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              background: '#f5f3ef'
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImageUrl}
              alt="投胎结果海报"
              style={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: 14,
                userSelect: 'auto',
                WebkitTouchCallout: 'default'
              }}
            />
          </div>
          <View width="100%">
            <Button
              color="primary"
              variant="faded"
              fullWidth
              onClick={handleClosePreview}
            >
              返回
            </Button>
          </View>
        </View>
      ) : (
        <View gap={3}>
          <Dismissible onClose={handleClose} closeAriaLabel="Close modal">
            <Modal.Title>分享</Modal.Title>
            <Modal.Subtitle>分享你的投胎结果</Modal.Subtitle>
          </Dismissible>
          {shareInfo.mode === 'world' ? (
            <Tabs variant="pills">
              <View gap={3}>
                <View>
                  <Tabs.Panel value="1">
                    <WorldShareStyle1 shareInfo={shareInfo} />
                  </Tabs.Panel>
                  <Tabs.Panel value="2">
                    <WorldShareStyle2 shareInfo={shareInfo} />
                  </Tabs.Panel>
                  <Tabs.Panel value="3">
                    <WorldShareStyle3 shareInfo={shareInfo} />
                  </Tabs.Panel>
                </View>
                <Tabs.List>
                  <Tabs.Item value="1">样式一</Tabs.Item>
                  <Tabs.Item value="2">样式二</Tabs.Item>
                  <Tabs.Item value="3">样式三</Tabs.Item>
                </Tabs.List>
              </View>
            </Tabs>
          ) : shareInfo.mode === 'dynasty' ? (
            <DynastySharePoster shareInfo={shareInfo} />
          ) : (
            <Tabs variant="pills">
              <View gap={3}>
                <View>
                  <Tabs.Panel value="1">
                    <ShareStyle1 shareInfo={shareInfo} />
                  </Tabs.Panel>
                  <Tabs.Panel value="2">
                    <ShareStyle2 shareInfo={shareInfo} />
                  </Tabs.Panel>
                  <Tabs.Panel value="3">
                    <ShareStyle3 shareInfo={shareInfo} />
                  </Tabs.Panel>
                </View>
                <Tabs.List>
                  <Tabs.Item value="1">样式一</Tabs.Item>
                  <Tabs.Item value="2">样式二</Tabs.Item>
                  <Tabs.Item value="3">样式三</Tabs.Item>
                </Tabs.List>
              </View>
            </Tabs>
          )}
          <ModalFooter
            onCancel={handleClose}
            onSave={handleSaveAsImage}
            isSaving={isSaving}
          />
        </View>
      )}
    </Modal>
  );
}

export default ShareModal;

