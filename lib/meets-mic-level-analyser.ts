/**
 * Đo RMS từ MediaStreamTrack (mic) — dùng cho precheck và wave trong call.
 * Không nối destination để tránh feedback.
 */
export function subscribeMicLevel(
  mediaStreamTrack: MediaStreamTrack,
  onLevel: (level01: number) => void,
): () => void {
  let raf = 0;
  let closed = false;

  const ctx = new AudioContext();
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.65;

  const source = ctx.createMediaStreamSource(new MediaStream([mediaStreamTrack]));
  source.connect(analyser);

  const data = new Uint8Array(analyser.fftSize);

  const tick = () => {
    if (closed) {
      return;
    }
    void ctx.resume().catch(() => {
      /* Safari / policy */
    });

    if (mediaStreamTrack.readyState === "ended") {
      onLevel(0);
      return;
    }

    analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i]! - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / data.length);
    /** Boost nhẹ để thanh dễ thấy khi nói nhỏ */
    onLevel(Math.min(1, rms * 5));
    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);

  return () => {
    closed = true;
    cancelAnimationFrame(raf);
    source.disconnect();
    analyser.disconnect();
    void ctx.close();
  };
}
