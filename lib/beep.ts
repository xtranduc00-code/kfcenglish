let audioContext: AudioContext | null = null;
function getAudioContext(): AudioContext | null {
    if (typeof window === "undefined")
        return null;
    const AudioContextCtor = window.AudioContext ||
        (window as Window & typeof globalThis & {
            webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;
    if (!AudioContextCtor)
        return null;
    if (!audioContext || audioContext.state === "closed") {
        audioContext = new AudioContextCtor();
    }
    return audioContext;
}
export async function playBeep(frequency = 1000, duration = 220, volume = 0.08): Promise<void> {
    const context = getAudioContext();
    if (!context)
        return;
    if (context.state === "suspended") {
        try {
            await context.resume();
        }
        catch {
        }
    }
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const now = context.currentTime;
    const attack = 0.01;
    const release = 0.03;
    const durationSec = duration / 1000;
    const endTime = now + durationSec;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, now);
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + attack);
    gainNode.gain.setValueAtTime(volume, Math.max(now + attack, endTime - release));
    gainNode.gain.linearRampToValueAtTime(0, endTime);
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(endTime);
    oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
    };
}
