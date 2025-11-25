
import React from 'react';
import Spinner from '../Spinner';

interface LoaderProps {
    message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => (
    <div className="flex flex-col items-center justify-center p-4 space-y-3">
        <Spinner className="w-8 h-8 text-orange-600" />
        {message && <p className="text-sm text-gray-500 font-medium animate-pulse">{message}</p>}
    </div>
);

export default Loader;
