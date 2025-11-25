
import React, { useState } from 'react';
import { ReportParameters } from '../types';
import { ORGANIZATION_TYPES, ORGANIZATION_SUBTYPES } from '../constants';
import { generateFastSuggestion } from '../services/nexusService';
import { SavedWorkManager } from './SavedWorkManager';

interface ProfileStepProps {
    params: ReportParameters;
    handleChange: (field: keyof ReportParameters, value: any) => void;
    onParamsChange?: (params: ReportParameters) => void;
    inputStyles: string;
    labelStyles: string;
    savedReports?: ReportParameters[];
    onSave?: (params: ReportParameters) => void;
    onLoad?: (params: ReportParameters) => void;
    onDelete?: (reportName: string) => void;
}

const UploadIcon = ({className}: {className?: string}) => <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>;

export const ProfileStep: React.FC<ProfileStepProps> = ({ 
    params, handleChange, onParamsChange, inputStyles, labelStyles,
    savedReports = [], onSave, onLoad, onDelete
}) => {
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);

    const handleProblemBlur = async () => {
        if (!params.problemStatement || params.problemStatement.length < 5) return;
        setIsSuggesting(true);
        const result = await generateFastSuggestion(params.problemStatement, "Strategic Objective refinement");
        setSuggestion(result);
        setIsSuggesting(false);
    };

    const applySuggestion = () => {
        if (suggestion) {
            handleChange('problemStatement', suggestion);
            setSuggestion(null);
        }
    };

    const handleOrgTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        
        if (onParamsChange) {
            // Atomic update to prevent race conditions
            onParamsChange({
                ...params,
                organizationType: newType,
                organizationSubType: '', // Reset sub-type to avoid invalid state
                customOrganizationSubType: '',
                customOrganizationType: '', // Reset custom type string if switching back to standard
                governmentLevel: ''
            });
        } else {
            // Fallback for non-atomic update
            handleChange('organizationType', newType);
            handleChange('organizationSubType', ''); 
            handleChange('customOrganizationSubType', '');
            handleChange('governmentLevel', '');
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleChange('uploadedFileName', file.name);
            handleChange('uploadedDocument', true);
            // In a real app, read file content here.
            console.log("File selected:", file.name);
        }
    };

    // Filter 'Other' from standard list if we are presenting it as 'Custom' manually
    const displayOrgTypes = ORGANIZATION_TYPES.filter(t => t !== 'Other');
    const subTypes = ORGANIZATION_SUBTYPES[params.organizationType] || [];
    
    // Show custom type input if 'Custom' is selected OR if the type isn't in our standard list
    const showCustomTypeInput = params.organizationType === 'Custom';
    
    // Show custom category input if 'Custom' is selected as sub-type OR if there are no presets for the selected type
    // But only if a type is actually selected
    const showCustomCategoryInput = params.organizationType && (params.organizationSubType === 'Custom' || subTypes.length === 0);

    return (
        <div className="grid gap-6 text-gray-900">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-black font-bold">1.</span> Organization Profile
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className={labelStyles}>Full Name *</label>
                        <input type="text" value={params.userName} onChange={e => handleChange('userName', e.target.value)} className={inputStyles} placeholder="John Doe" />
                    </div>
                    <div>
                        <label className={labelStyles}>Department / Role</label>
                        <input type="text" value={params.userDepartment} onChange={e => handleChange('userDepartment', e.target.value)} className={inputStyles} placeholder="Head of Strategy" />
                    </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                     <div>
                        <label className={labelStyles}>Organization Type *</label>
                        <select value={params.organizationType} onChange={handleOrgTypeChange} className={inputStyles}>
                            <option value="">Select Type</option>
                            {displayOrgTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                            <option value="Custom">Other / Custom</option>
                        </select>
                        
                        {showCustomTypeInput && (
                            <input 
                                type="text" 
                                value={params.customOrganizationType || ''}
                                onChange={(e) => handleChange('customOrganizationType', e.target.value)}
                                className={`${inputStyles} mt-2 bg-yellow-50 border-yellow-200 focus:ring-yellow-500 focus:border-yellow-500`} 
                                placeholder="Specify Organization Type..."
                            />
                        )}
                    </div>
                     <div>
                        <label className={labelStyles}>Organization Category / Level *</label>
                        {subTypes.length > 0 ? (
                            <select 
                                value={params.organizationSubType || ''} 
                                onChange={e => handleChange('organizationSubType', e.target.value)} 
                                className={inputStyles}
                                disabled={!params.organizationType}
                            >
                                <option value="">Select Category</option>
                                {subTypes.map(sub => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                                <option value="Custom">Other (Specify below)</option>
                            </select>
                        ) : (
                            <div className="text-xs text-gray-500 mb-2 italic p-2 bg-gray-50 rounded border border-gray-200">
                                {params.organizationType && params.organizationType !== 'Custom' 
                                    ? "No preset categories found. Please specify below." 
                                    : "Select Organization Type first."}
                            </div>
                        )}
                        
                        {/* Show text input if 'Custom' selected OR no subtypes available for selected type */}
                        {showCustomCategoryInput && (
                            <input 
                                type="text" 
                                value={params.customOrganizationSubType || ''} 
                                onChange={e => handleChange('customOrganizationSubType', e.target.value)} 
                                className={`${inputStyles} mt-2 bg-yellow-50 border-yellow-200 focus:ring-yellow-500 focus:border-yellow-500`} 
                                placeholder="Enter Category / Level manually..." 
                            />
                        )}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelStyles}>Organization Address</label>
                        <input type="text" value={params.userAddress || ''} onChange={e => handleChange('userAddress', e.target.value)} className={inputStyles} placeholder="123 Business Rd, City, Country" />
                    </div>
                    <div>
                        <label className={labelStyles}>Website URL</label>
                        <input type="url" value={params.userWebsite || ''} onChange={e => handleChange('userWebsite', e.target.value)} className={inputStyles} placeholder="https://www.example.com" />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-black font-bold">2.</span> Strategic Context & Uploads
                </h3>

                <div className="mb-6">
                    <label className={labelStyles}>Report Name *</label>
                    <input type="text" value={params.reportName} onChange={e => handleChange('reportName', e.target.value)} className={inputStyles} placeholder="e.g., Project Alpha Expansion Strategy" />
                </div>
                
                 <div className="mb-6">
                    <label className={labelStyles}>Quick Strategic Intent (Draft)</label>
                    <div className="relative">
                        <textarea 
                            value={params.problemStatement} 
                            onChange={e => handleChange('problemStatement', e.target.value)} 
                            onBlur={handleProblemBlur}
                            className={inputStyles} 
                            rows={3}
                            placeholder="Briefly describe what you want to achieve (e.g., 'Expand manufacturing to Vietnam')..." 
                        />
                        {isSuggesting && <div className="absolute right-2 bottom-2 text-xs text-black animate-pulse">Refining...</div>}
                    </div>
                    {suggestion && (
                        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-start gap-2">
                            <div>
                                <span className="text-xs font-bold text-black block mb-1">AI Suggestion:</span>
                                <p className="text-sm text-gray-700">{suggestion}</p>
                            </div>
                            <button onClick={applySuggestion} className="text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-800 font-bold">Apply</button>
                        </div>
                    )}
                </div>

                {/* Document Upload Section */}
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-center group">
                    <input 
                        type="file" 
                        id="doc-upload" 
                        className="hidden" 
                        onChange={handleFileUpload}
                        accept=".pdf,.docx,.txt"
                    />
                    <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center justify-center">
                        <UploadIcon className="w-8 h-8 text-gray-400 group-hover:text-black mb-2" />
                        <span className="text-sm font-medium text-gray-900">
                            {params.uploadedFileName ? params.uploadedFileName : "Upload Strategic Documents (Optional)"}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                            {params.uploadedFileName ? "Click to replace" : "PDF, DOCX, or TXT. Helps AI tailor the analysis."}
                        </span>
                    </label>
                </div>
            </div>

            {onSave && onLoad && onDelete && (
                <SavedWorkManager 
                    currentParams={params}
                    savedReports={savedReports}
                    onSave={onSave}
                    onLoad={onLoad}
                    onDelete={onDelete}
                />
            )}
        </div>
    );
};
