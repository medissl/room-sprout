// Serialize device writes and allow a failed write to be retried without poisoning the queue.
export function createSaveQueue(write: (payload: string) => Promise<void>) {
  let tail = Promise.resolve(true);
  return {
    enqueue(payload: string) {
      tail = tail.then(async () => {
        try {
          await write(payload);
          return true;
        } catch {
          return false;
        }
      });
      return tail;
    },
  };
}
