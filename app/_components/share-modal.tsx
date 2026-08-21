'use client';

import React, { useCallback, useMemo, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button, Dismissible, Loader, Modal, Tabs, Text, View } from 'reshaped';
import useShareModal, { ShareInfo } from '@/lib/store/useShareModal';
import html2canvas from 'html2canvas';
import { CarrotIcon } from '@/components/title';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import ChinaMap from '@/components/icon';
import { translateGenderChild } from '@/lib/rebirth';
import { formatWorldProbability } from '@/lib/world-rebirth';
import {
  blobToDataUrl,
  generateDynastyShareImage
} from '@/lib/dynasty-share-canvas';
import './dynasty-share-poster.css';
import { RebirthToast } from '@/components/rebirth-toast';

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
          <span className="text-primary font-medium">{shareInfo.count}</span>{' '}
          次投胎在
          <span className="text-primary font-medium">{shareInfo.region}</span>
          （
          <span className="text-primary font-medium">
            {shareInfo.continent}
          </span>
          ），概率只有{' '}
          <span className="text-primary font-medium">
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
            <span className="text-primary font-medium">{shareInfo.count}</span>{' '}
            次
          </Text>
          <Text variant="body-2" weight="medium" className="z-10">
            我投胎在了
            <span className="text-primary font-medium">{shareInfo.region}</span>
          </Text>
          <Text variant="body-2" weight="medium" className="z-10">
            大洲
            <span className="text-primary font-medium">
              {shareInfo.continent}
            </span>
          </Text>
          <Text variant="body-2" weight="medium" className="z-10">
            概率只有{' '}
            <span className="text-primary font-medium">
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
        <View direction="column" paddingBottom={4}>
          <Text variant="body-2" weight="medium" className="z-10">
            第{' '}
            <span className="text-primary font-medium">
              {shareInfo.count}
            </span>{' '}
            次
          </Text>
          <Text variant="body-2" weight="medium" className="z-10">
            我投胎在了
            <span className="text-primary font-medium">
              {shareInfo.region}
            </span>
          </Text>
          <Text variant="body-2" weight="medium" className="z-10">
            大洲
            <span className="text-primary font-medium">
              {shareInfo.continent}
            </span>
          </Text>
          <Text variant="body-2" weight="medium" className="z-10">
            概率只有{' '}
            <span className="text-primary font-medium">
              {formatWorldProbability(shareInfo.probability)}
            </span>
          </Text>
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
              <span className="text-primary font-medium">
                {shareInfo.count}
              </span>{' '}
              次投胎在
              <span className="text-primary font-medium">
                {shareInfo.region}
              </span>
              ，是一个
              <span className="text-primary font-medium">
                {translateGenderChild(shareInfo.gender)}
              </span>
              ，你也来试试吧！
            </>
          ) : (
            <>
              我在投胎模拟器第{' '}
              <span className="text-primary font-medium">
                {shareInfo.count}
              </span>{' '}
              次投胎在
              <span className="text-primary font-medium">
                {shareInfo.region}的{shareInfo.category}
              </span>
              ，是家里
              <span className="text-primary font-medium">
                第{shareInfo.order}个{translateGenderChild(shareInfo.gender)}
              </span>
              ，概率只有{' '}
              <span className="text-primary font-medium">
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
                <span className="text-primary font-medium">
                  {shareInfo.count}
                </span>{' '}
                次
              </Text>
              <Text variant="body-2" weight="medium" className="z-10">
                我投胎在了
                <span className="text-primary font-medium">
                  {shareInfo.region}
                </span>
              </Text>
              <Text variant="body-2" weight="medium" className="z-10">
                是一个
                <span className="text-primary font-medium">
                  {translateGenderChild(shareInfo.gender)}
                </span>
              </Text>
              <Text variant="body-2" weight="medium" className="z-10">
                概率只有{' '}
                <span className="text-primary font-medium">
                  {shareInfo.probability.toPrecision(2)}%
                </span>
              </Text>
            </>
          ) : (
            <>
              <Text variant="body-2" weight="medium" className="z-10">
                第{' '}
                <span className="text-primary font-medium">
                  {shareInfo.count}
                </span>{' '}
                次
              </Text>
              <Text variant="body-2" weight="medium" className="z-10">
                我投胎在了
                <span className="text-primary font-medium">
                  {shareInfo.region}的{shareInfo.category}
                </span>
              </Text>
              <Text variant="body-2" weight="medium" className="z-10">
                是家里
                <span className="text-primary font-medium">
                  第{shareInfo.order}个{translateGenderChild(shareInfo.gender)}
                </span>
              </Text>
              <Text variant="body-2" weight="medium" className="z-10">
                概率只有{' '}
                <span className="text-primary font-medium">
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
        <View direction="column" paddingBottom={4}>
          {['香港', '澳门', '台湾'].includes(shareInfo.region) ? (
            <>
              <Text variant="body-2" weight="medium" className="z-10">
                第{' '}
                <span className="text-primary font-medium">
                  {shareInfo.count}
                </span>{' '}
                次
              </Text>
              <Text variant="body-2" weight="medium" className="z-10">
                我投胎在了
                <span className="text-primary font-medium">
                  {shareInfo.region}
                </span>
              </Text>
              <Text variant="body-2" weight="medium" className="z-10">
                是一个
                <span className="text-primary font-medium">
                  {translateGenderChild(shareInfo.gender)}
                </span>
              </Text>
              <Text variant="body-2" weight="medium" className="z-10">
                概率只有{' '}
                <span className="text-primary font-medium">
                  {shareInfo.probability.toPrecision(2)}%
                </span>
              </Text>
            </>
          ) : (
            <>
              <Text variant="body-2" weight="medium" className="z-10">
                第{' '}
                <span className="text-primary font-medium">
                  {shareInfo.count}
                </span>{' '}
                次
              </Text>
              <Text variant="body-2" weight="medium" className="z-10">
                我投胎在了
                <span className="text-primary font-medium">
                  {shareInfo.region}的{shareInfo.category}
                </span>
              </Text>
              <Text variant="body-2" weight="medium" className="z-10">
                是家里
                <span className="text-primary font-medium">
                  第{shareInfo.order}个
                  {translateGenderChild(shareInfo.gender)}
                </span>
              </Text>
              <Text variant="body-2" weight="medium" className="z-10">
                概率只有{' '}
                <span className="text-primary font-medium">
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

function ModalFooter({
  onCancel,
  onSave,
  isSaving,
  saveDisabled
}: {
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
  saveDisabled?: boolean;
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
          disabled={saveDisabled || isSaving}
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

async function waitForShareFonts() {
  if (typeof document === 'undefined' || !document.fonts?.ready) return;
  try {
    await document.fonts.ready;
  } catch {
    // draw with fallbacks if font loading fails
  }
}

type DynastyPosterAsset = {
  blob: Blob;
  dataUrl: string;
};

function getDynastyShareCacheKey(shareInfo: ShareInfo) {
  return [
    shareInfo.count,
    shareInfo.dynastyId,
    shareInfo.className,
    shareInfo.classDesc,
    shareInfo.flavor,
    shareInfo.classLevel,
    shareInfo.gender,
    shareInfo.probability
  ].join('|');
}

function DynastyShareImagePreloader({
  shareInfo,
  cacheKey,
  onReady
}: {
  shareInfo: ShareInfo;
  cacheKey: string;
  onReady: (key: string, asset: DynastyPosterAsset) => void;
}) {
  useEffect(() => {
    let cancelled = false;

    generateDynastyShareImage(shareInfo)
      .then(blob => blobToDataUrl(blob).then(dataUrl => ({ blob, dataUrl })))
      .then(asset => {
        if (!cancelled) {
          onReady(cacheKey, asset);
        }
      })
      .catch(err => {
        console.error('Failed to preload dynasty share poster:', err);
      });

    return () => {
      cancelled = true;
    };
  }, [shareInfo, cacheKey, onReady]);

  return null;
}

function DynastyShareCanvasPreview({
  poster
}: {
  poster: DynastyPosterAsset | null;
}) {
  if (!poster) {
    return (
      <View
        direction="column"
        gap={2}
        align="center"
        justify="center"
        height={80}
      >
        <Loader />
        <Text>海报生成中</Text>
      </View>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="dynasty-share-canvas-preview"
      src={poster.dataUrl}
      alt="投胎结果海报"
    />
  );
}

function ShareModal() {
  const { active, deactivate, shareInfo } = useShareModal();
  const [isSaving, setIsSaving] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [dynastyPoster, setDynastyPoster] = useState<DynastyPosterAsset | null>(
    null
  );
  const [dynastyPosterKey, setDynastyPosterKey] = useState<string | null>(null);

  const dynastyShareCacheKey = useMemo(
    () =>
      shareInfo.mode === 'dynasty' ? getDynastyShareCacheKey(shareInfo) : '',
    [shareInfo]
  );
  const cachedDynastyPoster =
    dynastyPosterKey === dynastyShareCacheKey ? dynastyPoster : null;

  const handleDynastyPosterReady = useCallback(
    (key: string, asset: DynastyPosterAsset) => {
      setDynastyPoster(asset);
      setDynastyPosterKey(key);
    },
    []
  );

  const handleClose = () => {
    if (previewImageUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewImageUrl);
    }
    setPreviewImageUrl(null);
    setDynastyPoster(null);
    setDynastyPosterKey(null);
    deactivate();
  };

  const handleClosePreview = () => {
    if (previewImageUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(previewImageUrl);
    }
    setPreviewImageUrl(null);
  };

  async function handleSaveAsImage() {
    if (isSaving) return;

    setIsSaving(true);

    try {
      let blob: Blob | null = null;
      let dataUrl = '';
      const filename =
        shareInfo.mode === 'dynasty'
          ? `投胎模拟器-王朝版-第${shareInfo.count}次.png`
          : `投胎模拟器-第${shareInfo.count}次.png`;

      if (shareInfo.mode === 'dynasty') {
        let asset = cachedDynastyPoster;
        if (!asset) {
          const generatedBlob = await generateDynastyShareImage(shareInfo);
          const generatedDataUrl = await blobToDataUrl(generatedBlob);
          asset = { blob: generatedBlob, dataUrl: generatedDataUrl };
          setDynastyPoster(asset);
          setDynastyPosterKey(dynastyShareCacheKey);
        }
        blob = asset.blob;
        dataUrl = asset.dataUrl;
      } else {
        const shareContent = document.getElementById('shareContent');
        if (!shareContent) return;

        await waitForShareMapReady(shareContent);
        await waitForShareImages(shareContent);
        await waitForShareFonts();
        await new Promise<void>(resolve =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        );

        const canvas = await html2canvas(shareContent, {
          scale: 3,
          useCORS: true,
          allowTaint: true
        });

        dataUrl = canvas.toDataURL('image/png');
        blob = await new Promise<Blob | null>(resolve =>
          canvas.toBlob(resolve, 'image/png')
        );
      }

      if (!dataUrl) {
        throw new Error('Failed to generate image');
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
        blob &&
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

      // 2. On mobile (WeChat or navigator.share fallback), display preview with base64 data URL for long-press saving
      if (isMobile) {
        setPreviewImageUrl(dataUrl);
        return;
      }

      // 3. On desktop, trigger standard download
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();

      toast.custom(t => (
        <RebirthToast toastId={t} tone="positive">
          <Text color="positive">图片已保存</Text>
        </RebirthToast>
      ));
    } catch (err) {
      console.error('Error capturing image:', err);
      toast.custom(t => (
        <RebirthToast toastId={t} tone="critical">
          <Text color="critical">图片生成失败，请重试</Text>
        </RebirthToast>
      ));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal
      active={active}
      onClose={handleClose}
      overlayClassName="share-modal-overlay"
      className="share-modal-dialog"
      position={{ s: 'bottom', m: 'center' }}
    >
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
              background: '#f3efe8'
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
          <Dismissible onClose={handleClose} closeAriaLabel="关闭对话框">
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
            <>
              {active ? (
                <DynastyShareImagePreloader
                  key={dynastyShareCacheKey}
                  shareInfo={shareInfo}
                  cacheKey={dynastyShareCacheKey}
                  onReady={handleDynastyPosterReady}
                />
              ) : null}
              <DynastyShareCanvasPreview poster={cachedDynastyPoster} />
            </>
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
            saveDisabled={
              shareInfo.mode === 'dynasty' && !cachedDynastyPoster
            }
          />
        </View>
      )}
    </Modal>
  );
}

export default ShareModal;

