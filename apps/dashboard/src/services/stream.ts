export type SSEEvent = {
  event: string;
  data: any;
};

export class StreamService {
  private eventSource: EventSource | null = null;

  connect(url: string, payload: any, onMessage: (msg: SSEEvent) => void, onError: (err: any) => void) {
    this.disconnect();
    this.streamWithFetch(url, payload, onMessage, onError);
  }

  private async streamWithFetch(url: string, payload: any, onMessage: (msg: SSEEvent) => void, onError: (err: any) => void) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.body) throw new Error("No readable stream available");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Split by double newline which dictates SSE event boundaries (handle both \n\n and \r\n\r\n)
        const chunks = buffer.split(/\r?\n\r?\n/);
        buffer = chunks.pop() || ""; // Keep the incomplete chunk in the buffer

        for (const chunk of chunks) {
          if (!chunk.trim()) continue;
          
          let eventType = "message";
          let eventData = "";

          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventType = line.substring(6).trim();
            } else if (line.startsWith('data:')) {
              eventData += line.substring(5).trim();
            }
          }

          if (eventData) {
            try {
              const parsed = JSON.parse(eventData);
              onMessage({ event: eventType, data: parsed });
            } catch (e) {
              onMessage({ event: eventType, data: eventData });
            }
          }
        }
      }
    } catch (err) {
      onError(err);
    }
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

export const streamService = new StreamService();
