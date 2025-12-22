import { WS_BASE_URL } from "../config";

export default function WsClient() {
  let ws: WebSocket | null = null;
  let keepalive: any = null;

  function connect(runId: string, onMessage: (msg: any) => void) {
    disconnect();

    ws = new WebSocket(`${WS_BASE_URL}/ws/stream/${runId}`);

    ws.onopen = () => {
      keepalive = setInterval(() => {
        try {
          ws?.send(JSON.stringify({ type: "ping" }));
        } catch {}
      }, 20000);
    };

    ws.onmessage = (ev) => {
      try {
        onMessage(JSON.parse(ev.data));
      } catch (e) {
        console.error("ws parse error", e);
      }
    };

    ws.onclose = () => {
      clearInterval(keepalive);
      keepalive = null;
    };
  }

  function disconnect() {
    if (ws) {
      try { ws.close(); } catch {}
      ws = null;
    }
  }

  return { connect, disconnect };
}
