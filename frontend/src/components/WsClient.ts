export default function WsClient() {
  let ws: WebSocket | null = null;
  let keepalive: any = null;

  function connect(runId: string, onMessage: (msg: any) => void) {
    disconnect();
    const base = (location.protocol === "https:" ? "wss://" : "ws://") + window.location.host;
    ws = new WebSocket(`${base}/ws/stream/${runId}`);
    ws.onopen = () => {
      keepalive = setInterval(() => {
        try { ws?.send(JSON.stringify({ type: "ping" })); } catch {}
      }, 20000);
    };
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        onMessage(msg);
      } catch (e) {
        console.error("ws parse", e);
      }
    };
    ws.onclose = () => {
      clearInterval(keepalive);
      keepalive = null;
    };
    ws.onerror = () => {
      // ignore errors for now
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
