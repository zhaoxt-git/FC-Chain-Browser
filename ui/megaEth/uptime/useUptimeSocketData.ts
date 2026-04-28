import React from 'react';

import type { UptimeHistoryFull, UptimeRealTimeData, UptimeSocketData } from 'types/api/megaEth';

import config from 'configs/app';
import { SECOND } from 'toolkit/utils/consts';

const megaEthFeature = config.features.megaEth;

export type Status = 'initial' | 'connected' | 'disconnected' | 'error';

export default function useUptimeSocketData() {
  const websocketRef = React.useRef<WebSocket | null>(null);
  const heartbeatRef = React.useRef<number | undefined>(undefined);
  const [ status, setStatus ] = React.useState<Status>('connected');
  
  const generateHistory = (base: number, volatility: number) => {
    const arr = [];
    const nowSecs = Math.floor(Date.now() / 1000);
    for (let i = 0; i < 180; i++) {
        // Create an oscillating, spiky curve
        const wave = Math.sin(i * 0.1) * (volatility * 0.5);
        const noise = (Math.random() - 0.5) * volatility;
        const value = Math.max(0, base + wave + noise);
        arr.push({ value, timestamp: nowSecs - (180 - i) * 60 });
    }
    return arr;
  };

  const [ realtimeData, setRealtimeData ] = React.useState<UptimeRealTimeData | null>({
    end_block: 1530948,
    instant_mgas_per_second: 54.3,
    instant_mini_block_interval: 0.11,
    instant_tps: 153.2,
    latest_mini_block_id: 153094801,
    updated_at: new Date().toISOString(),
  });
  
  const [ historyData, setHistoryData ] = React.useState<UptimeHistoryFull | null>({
    historical_gas_per_second_3h: generateHistory(50_000_000, 20_000_000), // ~50 Mgas
    historical_gas_per_second_7d: generateHistory(50_000_000, 20_000_000),
    historical_gas_per_second_24h: generateHistory(50_000_000, 20_000_000),
    historical_tps_3h: generateHistory(150, 40),
    historical_tps_7d: generateHistory(150, 40),
    historical_tps_24h: generateHistory(150, 40),
    historical_mini_block_interval_3h: generateHistory(0.12, 0.05),
    historical_mini_block_interval_7d: generateHistory(0.12, 0.05),
    historical_mini_block_interval_24h: generateHistory(0.12, 0.05),
  });

  const connect = React.useCallback(() => {
    return;
    if (!megaEthFeature.isEnabled || !megaEthFeature.socketUrl.metrics) {
      return;
    }

    websocketRef.current = new WebSocket(megaEthFeature.socketUrl.metrics);

    websocketRef.current.onmessage = async(event) => {
      try {
        const data = JSON.parse(event.data) as UptimeSocketData;
        switch (data.type) {
          case 'realtime_metrics':
            setRealtimeData(data.realtime);
            break;
          case 'history_full':
            setHistoryData(data.data);
            break;
          case 'history_delta':
            setHistoryData((prev) => {
              if (!prev) {
                return null;
              }

              return Object.entries(data.data).reduce((acc, [ key, value ]) => {
                acc[key as keyof UptimeHistoryFull] = [ ...(acc[key as keyof UptimeHistoryFull] || []), value ];

                return acc;
              }, { ...prev });
            });
            break;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    };

    websocketRef.current.onopen = () => {
      setStatus('connected');

      heartbeatRef.current = window.setInterval(() => {
        if (websocketRef.current?.readyState === WebSocket.OPEN) {
          websocketRef.current?.send('ping');
        }
      }, 10 * SECOND);
    };
    websocketRef.current.onerror = (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      setStatus('error');
    };
    websocketRef.current.onclose = (event) => {
      // eslint-disable-next-line no-console
      console.error('WebSocket closed', event);
      setStatus('disconnected');
    };
  }, []);

  const onReconnect = React.useCallback(() => {
    connect();
  }, [ connect ]);

  React.useEffect(() => {
    connect();

    return () => {
      websocketRef.current?.close(4000, 'Component unmounted');
      window.clearInterval(heartbeatRef.current);
    };
  }, [ connect ]);

  return { status, realtimeData, historyData, onReconnect };
}
