import { useState, useEffect, useCallback } from 'react';

export type ScreenShareState =
    | 'idle'
    | 'requesting'
    | 'granted'
    | 'cancelled'
    | 'denied'
    | 'ended'
    | 'error';

interface ScreenShareMetadata {
    displayType?: 'monitor' | 'window' | 'browser' | 'application';
    width?: number;
    height?: number;
}

export function useScreenShare() {
    const [state, setState] = useState<ScreenShareState>('idle');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [metadata, setMetadata] = useState<ScreenShareMetadata | null>(null);

    // ✅ stable cleanup (no dependency on stream)
    const cleanup = useCallback(() => {
        setStream(prev => {
            if (prev) {
                prev.getTracks().forEach(track => {
                    track.onended = null;
                    track.stop();
                });
            }
            return null;
        });
    }, []);

    const handleStart = useCallback(async () => {
        cleanup();
        setState('requesting');
        setMetadata(null);

        try {
            const mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: { frameRate: { ideal: 30 } },
                audio: false
            });

            const videoTrack = mediaStream.getVideoTracks()[0];

            videoTrack.onended = () => {
                setState('ended');
                cleanup();
            };

            const settings = videoTrack.getSettings();

            setMetadata({
                displayType: settings.displaySurface as ScreenShareMetadata['displayType'],
                width: settings.width,
                height: settings.height
            });

            setStream(mediaStream);
            setState('granted');

        } catch (err: unknown) {

            if (err instanceof Error &&
                (err.name === 'NotAllowedError' || err.name === 'AbortError')) {

                const msg = err.message.toLowerCase();

                if (msg.includes('user') || msg.includes('cancel')) {
                    setState('cancelled');
                } else {
                    setState('denied');
                }

            } else {
                setState('error');
            }
        }
    }, [cleanup]);

    const handleStop = useCallback(() => {
        setState('ended');
        cleanup();
    }, [cleanup]);

    useEffect(() => {
        return cleanup;
    }, [cleanup]);

    return {
        state,
        stream,
        metadata,
        handleStart,
        handleStop
    };
}