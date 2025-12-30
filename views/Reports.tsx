
import React from 'react';
import { Loan, Payment, LoanStatus } from '../types';

interface ReportsProps {
  loans: Loan[];
  payments: Payment[];
}

const Reports: React.FC<ReportsProps> = ({ loans, payments }) => {
  const reportCategories = [
    { name: 'Openstaande Posten', desc: 'Lijst met alle vervallen betalingen.' },
    { name: 'Uitstaande Leningen', desc: 'Totaal kapitaal in omloop.' },
    { name: 'Vervaldatums Hypotheek', desc: 'Overzicht van expirerende onderpanden.' },
    { name: 'Jaaroverzichten', desc: 'Overzichten voor belasting en cliënten.' }
  ];

  const totalArrears = loans
    .filter(l => l.status === LoanStatus.LATE)
    .reduce((acc, l) => acc + (l.balance * 0.05), 0); // Simulated penalty logic

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Vorderingen</p>
          <p className="text-2xl font-bold text-slate-800 mt-2">€{totalArrears.toLocaleString()}</p>
          <div className="h-1 w-full bg-red-100 mt-3 rounded-full overflow-hidden">
             <div className="h-full bg-red-500 w-1/3"></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Lopende Termijnen</p>
          <p className="text-2xl font-bold text-slate-800 mt-2">{loans.length} Dossiers</p>
          <p className="text-xs text-slate-400 mt-1">Spreiding over 3 regio's</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Genereren Rapportages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportCategories.map((report, idx) => (
            <div key={idx} className="p-4 border rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
              <div>
                <p className="font-bold text-slate-800">{report.name}</p>
                <p className="text-xs text-slate-500 mt-1">{report.desc}</p>
              </div>
              <button className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                📥
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 flex items-center gap-6">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-2xl text-white">📈</div>
        <div className="flex-1">
          <h4 className="font-bold text-indigo-900">Custom AI Rapportage</h4>
          <p className="text-sm text-indigo-700">Wilt u een specifieke analyse van uw portefeuille? Vraag het aan de AI analyst.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-500 transition-colors">
          Analist Openen
        </button>
      </div>
    </div>
  );
};

export default Reports;
