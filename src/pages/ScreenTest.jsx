import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useScreenShare } from '../hooks/useScreenShare';
import { Loader2, AlertCircle, MonitorPlay, XCircle, ArrowLeft } from 'lucide-react';

export default function ScreenTest() {
    const { state, stream, metadata, handleStart, handleStop } = useScreenShare();
    const videoRef = useRef(null);
    const navigate = useNavigate();

    // Ensuring we clear the video source immediately when stream becomes null
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream || null;
        }
    }, [stream]);

    const renderStateUi = () => {
        switch (state) {
            case 'idle':
                return (
                    <div className="text-center space-y-4">
                        <MonitorPlay className="w-16 h-16 mx-auto text-indigo-400" />
                        <p className="text-slate-300">Click below to start sharing your screen. A browser permission popup will appear.</p>
                        <Button onClick={handleStart} variant="primary">
                            Start Screen Share
                        </Button>
                    </div>
                );

            case 'requesting':
                return (
                    <div className="flex flex-col items-center justify-center space-y-4 p-8">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                        <p className="text-indigo-200">Waiting for permission... Please select a screen to share.</p>
                        <Button disabled variant="secondary">
                            Requesting...
                        </Button>
                    </div>
                );

            case 'cancelled':
                return (
                    <div className="text-center space-y-4 pt-10">
                        <XCircle className="w-16 h-16 mx-auto text-slate-400" />
                        <p className="text-slate-300">You cancelled the screen picker.</p>
                        <Button onClick={handleStart} variant="primary">Try Again</Button>
                    </div>
                );

            case 'denied':
                return (
                    <div className="text-center space-y-4 pt-10">
                        <AlertCircle className="w-16 h-16 mx-auto text-rose-500" />
                        <p className="text-rose-400 font-medium">Permission to share screen was denied.</p>
                        <p className="text-slate-400 text-sm max-w-sm mx-auto">Please check your system or browser settings ensuring screen recording permissions are enabled.</p>
                        <Button onClick={handleStart} variant="danger">Retry Request</Button>
                    </div>
                );

            case 'error':
                return (
                    <div className="text-center space-y-4 pt-10">
                        <AlertCircle className="w-16 h-16 mx-auto text-orange-500" />
                        <p className="text-orange-400">An unknown error occurred while trying to share the screen.</p>
                        <Button onClick={handleStart} variant="secondary">Retry</Button>
                    </div>
                );

            case 'granted':
                return (
                    <div className="w-full space-y-6">
                        <div className="flex justify-between items-center glass p-4 rounded-xl">
                            <div>
                                <h3 className="text-emerald-400 font-medium flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Screen Stream Active
                                </h3>
                                {metadata && (
                                    <div className="text-sm text-slate-400 mt-1 flex gap-4">
                                        <span>Type: <strong className="text-slate-200 capitalize">{metadata.displayType || 'Unknown'}</strong></span>
                                        {metadata.width && metadata.height && (
                                            <span>Resolution: <strong className="text-slate-200">{metadata.width}x{metadata.height}</strong></span>
                                        )}
                                    </div>
                                )}
                            </div>
                            <Button onClick={handleStop} variant="danger" className="text-sm">
                                Stop Sharing
                            </Button>
                        </div>

                        <div className="rounded-2xl overflow-hidden border border-slate-700/50 bg-black aspect-video flex items-center justify-center relative shadow-2xl">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                );

            case 'ended':
                return (
                    <div className="text-center space-y-6 p-8 glass rounded-2xl mx-auto max-w-md mt-10">
                        <div className="bg-slate-800/50 p-4 rounded-full inline-block">
                            <MonitorPlay className="w-10 h-10 text-slate-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-2">Screen sharing stopped</h2>
                            <p className="text-slate-400">The screen capture session has ended.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Button onClick={handleStart} variant="primary" className="w-full sm:w-auto">
                                Retry Screen Test
                            </Button>
                            <Button onClick={() => navigate('/')} variant="secondary" className="w-full sm:w-auto">
                                Back to Home
                            </Button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="py-12 w-full max-w-3xl mx-auto relative">
            <button
                onClick={() => navigate('/')}
                className="absolute top-0 left-0 flex items-center text-slate-400 hover:text-white transition-colors mb-8 group"
            >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back
            </button>

            <div className="mt-8">
                {renderStateUi()}
            </div>
        </div>
    );
}
