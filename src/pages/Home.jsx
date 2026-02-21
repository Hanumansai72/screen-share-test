import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { Monitor, AlertCircle } from 'lucide-react';

function Home() {
    const [hasMediaSupport, setHasMediaSupport] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if the browser supports getDisplayMedia
        const supported = !!(
            navigator.mediaDevices &&
            navigator.mediaDevices.getDisplayMedia
        );
        setHasMediaSupport(supported);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center space-y-8 mt-20 text-center glass p-10 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -z-10 -mr-10 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl -z-10 -ml-10 -mb-20"></div>

            <div className="bg-indigo-500/20 p-4 rounded-full">
                <Monitor className="w-12 h-12 text-indigo-400" />
            </div>

            <div className="space-y-4 max-w-lg">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-300 to-indigo-100 bg-clip-text text-transparent">
                    Screen Share Test App
                </h1>
                <p className="text-slate-400 text-lg">
                    A frontend demonstration of browser media permissions, stream lifecycle management, and clean React states.
                </p>
            </div>

            {hasMediaSupport === false && (
                <div className="flex items-center space-x-2 text-rose-400 bg-rose-500/10 px-4 py-3 rounded-lg border border-rose-500/20">
                    <AlertCircle className="w-5 h-5" />
                    <span>Your browser does not support screen sharing. Please use a modern version of Chrome or Edge.</span>
                </div>
            )}

            <Button
                onClick={() => navigate('/screen-test')}
                disabled={hasMediaSupport === false}
                className="text-lg px-8 py-3"
            >
                Start Screen Test
            </Button>
        </div>
    );
}

export default Home;
