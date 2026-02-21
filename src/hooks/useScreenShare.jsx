import { useState, useEffect, useCallback } from 'react';

export function useScreenShare() {
    const [state, setState] = useState('idle');
    const [stream, setStream] = useState(null);
    const [metadata, setMetadata] = useState(null);

    const cleanup = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach((track) => {
                track.stop();
                track.onended = null;
            });
            setStream(null);
        }
    }, [stream]);

    const handleStart = async () => {
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
                displayType: settings.displaySurface,
                width: settings.width,
                height: settings.height
            });

            setStream(mediaStream);
            setState('granted');
        } catch (error) {
            if (error.name === 'NotAllowedError' || error.name === 'AbortError') {
                const msg = error.message.toLowerCase();
                // Chrome explicitly uses "permission denied by system" when the OS blocks it, vs plain "permission denied" for user cancel
                if (msg.includes('user') || msg === 'permission denied' || msg.includes('cancel')) {
                    setState('cancelled');
                } else {
                    setState('denied');
                }
            } else {
                setState('error');
            }
        }
    };

    const handleStop = useCallback(() => {
        setState('ended');
        cleanup();
    }, [cleanup]);

    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);

    return {
        state,
        stream,
        metadata,
        handleStart,
        handleStop
    };
}
