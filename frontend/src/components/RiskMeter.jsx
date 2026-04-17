import React from 'react';

const RiskMeter = ({ score }) => {
  const isHighRisk = score > 0.7;
  return (
    <div className={`p-8 rounded-3xl border-2 transition-all ${isHighRisk ? 'border-red-600 bg-red-900/20' : 'border-slate-800 bg-slate-900'}`}>
      <h3 className="text-slate-400 text-xs font-bold uppercase mb-6 text-center">Threat Level</h3>
      <div className="flex justify-center mb-6">
        <div className={`h-32 w-32 rounded-full border-8 flex items-center justify-center ${isHighRisk ? 'border-red-600' : 'border-emerald-600'}`}>
           <span className="text-3xl font-mono">{(score * 100).toFixed(0)}%</span>
        </div>
      </div>
      <div className={`text-center py-2 rounded-lg font-bold ${isHighRisk ? 'bg-red-600' : 'bg-emerald-600'}`}>
        {isHighRisk ? 'SPOOF DETECTED' : 'HUMAN VERIFIED'}
      </div>
    </div>
  );
};
export default RiskMeter;
