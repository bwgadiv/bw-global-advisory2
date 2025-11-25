
import React from 'react';

interface ManualEntrySelectProps<T> {
    label: string;
    options: T[];
    value: T | undefined;
    onSelect: (option: T) => void;
    onManualChange: (value: string) => void;
    isManual: boolean;
    setIsManual: (isManual: boolean) => void;
    manualValue: string;
    displayKey: keyof T;
    valueKey: keyof T;
    placeholder?: string;
}

export const ManualEntrySelect = <T extends { [key: string]: any }>({
    label, options, value, onSelect, onManualChange, isManual, setIsManual, manualValue, displayKey, valueKey
}: ManualEntrySelectProps<T>) => {
    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                    <button
                        key={opt[valueKey]}
                        onClick={() => { setIsManual(false); onSelect(opt); }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                            !isManual && value && value[valueKey] === opt[valueKey]
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {opt[displayKey]}
                    </button>
                ))}
                <button
                    onClick={() => setIsManual(true)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                        isManual
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    Custom
                </button>
            </div>
        </div>
    );
};
