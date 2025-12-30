
import React from 'react';
import { UserRole } from '../types';
import { INITIAL_EXCHANGE_RATES } from '../constants';

interface SettingsProps {
  userRole: UserRole;
}

const Settings: React.FC<SettingsProps> = ({ userRole }) => {
  return (
    <div className="max-w-4xl space-y-8">
      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span>💱</span> Wisselkoersen Beheer
        </h3>
        <div className="space-y-4">
          {INITIAL_EXCHANGE_RATES.map(rate => (
            <div key={rate.currency} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white border rounded-lg flex items-center justify-center font-bold text-slate-500">
                  {rate.currency}
                </div>
                <div>
                  <p className="font-bold text-slate-700">1 USD = {rate.rate.toFixed(6)} {rate.currency}</p>
                  <p className="text-xs text-slate-400">Laatst bijgewerkt: {new Date(rate.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button className="text-indigo-600 text-sm font-bold hover:underline">Wijzigen</button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span>🛡️</span> Systeem & Beveiliging
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-slate-50">
            <div>
              <p className="font-semibold text-slate-700">Multi-Factor Authenticatie</p>
              <p className="text-xs text-slate-400">Verplicht inloggen met een extra code voor managers.</p>
            </div>
            <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1">
              <div className="w-4 h-4 bg-white rounded-full translate-x-6"></div>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-slate-50">
            <div>
              <p className="font-semibold text-slate-700">Automatische Back-ups</p>
              <p className="text-xs text-slate-400">Elke 6 uur een versleutelde back-up naar cloud opslag.</p>
            </div>
            <span className="text-green-600 text-xs font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> Actief
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-slate-700">Grootboek Koppeling</p>
              <p className="text-xs text-slate-400">API status voor koppeling met externe boekhouding.</p>
            </div>
            <button className="text-indigo-600 text-xs font-bold">Configureer API</button>
          </div>
        </div>
      </section>

      {userRole === UserRole.ADMIN && (
        <section className="bg-red-50 p-6 rounded-xl border border-red-100">
          <h3 className="text-lg font-bold text-red-800 mb-4">Admin Console</h3>
          <p className="text-sm text-red-700 mb-6">U heeft toegang tot systeem logs en gebruiker rechten management.</p>
          <div className="flex gap-4">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Audit Logs Bekijken</button>
            <button className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold">Systeem Opschonen</button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Settings;
