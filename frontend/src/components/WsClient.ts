import { WS_BASE_URL } from "../config";

export default function WsClient() {
  let ws: WebSocket | null = null;
  let keepalive: any = null;

  function connect(runId: string, onMessage: (msg: any) => void) {
    disconnect();

    ws = new WebSocket(`${WS_BASE_URL}/ws/stream/${runId}`);

    ws.onopen = () => {
      keepalive = setInterval(() => {
        ws?.send(JSON.stringify({ type: "ping" }));
      }, 20000);
    };

    ws.onmessage = (ev) => {
      onMessage(JSON.parse(ev.data));
    };

    ws.onclose = () => {
      clearInterval(keepalive);
    };
  }

  function disconnect() {
    ws?.close();
    ws = null;
  }

  return { connect, disconnect };
}

