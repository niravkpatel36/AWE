const WS_BASE_URL =
  import.meta.env.VITE_WS_BASE_URL ??
  import.meta.env.VITE_API_BASE_URL?.replace("https://", "wss://");

export default function WsClient() {
  let ws: WebSocket | null = null;
  let keepalive: any = null;

  function connect(runId: string, onMessage: (msg: any) => void) {
    disconnect();

    ws = new WebSocket(`${WS_BASE_URL}/ws/stream/${runId}`);

    ws.onopen = () => {
      keepalive = setInterval(() => {
        try { ws?.send("ping"); } catch {}
      }, 20000);
    };

    ws.onmessage = (ev) => {
      try {
        onMessage(JSON.parse(ev.data));
      } catch {}
    };

    ws.onclose = () => {
      clearInterval(keepalive);
    };
  }

  function disconnect() {
    try { ws?.close(); } catch {}
    ws = null;
  }

  return { connect, disconnect };
}

