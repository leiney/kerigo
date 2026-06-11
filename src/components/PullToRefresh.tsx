import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

type Props = {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  children: React.ReactNode;
};

const PullToRefresh: React.FC<Props> = ({ onRefresh, threshold = 70, children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startYRef = useRef<number | null>(null);
  const pullRef = useRef<number>(0); // source of truth — no stale closures
  const refreshingRef = useRef(false);
  const animRef = useRef<number | null>(null);

  // Only drive re-renders for what actually needs to paint
  const [loaderState, setLoaderState] = useState<{
    pull: number;
    refreshing: boolean;
    visible: boolean;
  }>({ pull: 0, refreshing: false, visible: false });

  const cancelAnim = () => {
    if (animRef.current != null) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
  };

  // Animates pullRef from its current value to `target`, then calls onDone
  const animateTo = useCallback(
    (target: number, duration: number, onDone?: () => void) => {
      cancelAnim();
      const startVal = pullRef.current;
      let startTime: number | null = null;

      const step = (now: number) => {
        if (startTime == null) startTime = now;
        const t = Math.min(1, (now - startTime) / duration);
        // ease-out cubic
        const ease = 1 - Math.pow(1 - t, 3);
        const value = startVal + (target - startVal) * ease;
        pullRef.current = value;
        setLoaderState((prev) => ({ ...prev, pull: value }));

        if (t < 1) {
          animRef.current = requestAnimationFrame(step);
        } else {
          pullRef.current = target;
          animRef.current = null;
          onDone?.();
        }
      };

      animRef.current = requestAnimationFrame(step);
    },
    []
  );

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (refreshingRef.current) return;
      const scrollTop =
        (containerRef.current?.scrollTop ?? 0) || window.scrollY || 0;
      if (scrollTop > 0) return;
      cancelAnim();
      startYRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (refreshingRef.current) return;
      if (startYRef.current == null) return;
      const delta = Math.max(0, e.touches[0].clientY - startYRef.current);
      if (delta > 0) e.preventDefault();

      // Rubber-band resistance
      const maxPull = threshold + 40;
      const capped =
        delta <= threshold
          ? delta
          : threshold + (delta - threshold) * 0.35;
      const next = Math.min(capped, maxPull);
      pullRef.current = next;
      setLoaderState({ pull: next, refreshing: false, visible: next > 0 });
    };

    const onTouchEnd = async () => {
      if (startYRef.current == null) return;
      startYRef.current = null;
      const pulled = pullRef.current;

      if (pulled >= threshold) {
        // Snap to threshold position and spin
        refreshingRef.current = true;
        pullRef.current = threshold;
        setLoaderState({ pull: threshold, refreshing: true, visible: true });

        try {
          await Promise.resolve(onRefresh());
        } catch (err) {
          console.error('PullToRefresh onRefresh error', err);
        }

        // Hold briefly so user sees completion
        await new Promise((r) => setTimeout(r, 350));

        refreshingRef.current = false;

        // Slide OUT upward through the top
        animateTo(-64, 340, () => {
          setLoaderState({ pull: 0, refreshing: false, visible: false });
          pullRef.current = 0;
        });
      } else {
        // Didn't reach threshold — retract
        animateTo(0, 200, () => {
          setLoaderState({ pull: 0, refreshing: false, visible: false });
        });
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      cancelAnim();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefresh, threshold]); // NOT pull — avoids stale closure churn

  // ─── Visual calculations ───────────────────────────────────────────────────
  const { pull, refreshing, visible } = loaderState;

  // Loader starts 56px above viewport (hidden), slides in as pull grows
  // When animating out after refresh, pull goes negative → slides back above
  const loaderTop = Math.min(40, -56 + pull);

  // Rotation: 0 → 180° as user pulls down to threshold.
  // When they reverse pull (push back up), pull decreases → rotation decreases.
  // During active refresh, CSS animation takes over (animate-spin).
  const rotationDeg = refreshing
    ? 0 // CSS spin animation handles it
    : (Math.min(Math.max(pull, 0), threshold) / threshold) * 360;

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-auto touch-pan-y"
    >
      {/* Floating loader — lives above the content, never pushes it */}
      {visible && (
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 z-50"
          style={{
            top: `${loaderTop}px`,
            pointerEvents: 'none',
            transition: refreshing
              ? 'top 0.22s cubic-bezier(0.34,1.56,0.64,1)' // spring snap in
              : 'none', // during active pull, follow finger raw
          }}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md">
            <RefreshCw
              size={20}
              className={`text-primary ${refreshing ? 'animate-spin' : ''}`}
              style={
                refreshing
                  ? undefined
                  : {
                      transform: `rotate(${rotationDeg}deg)`,
                      transition: 'transform 0.05s linear',
                    }
              }
            />
          </div>
        </div>
      )}

      <div>{children}</div>
    </div>
  );
};

export default PullToRefresh;