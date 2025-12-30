
import React, { useState } from 'react';
import { Loan, Client, LoanStatus, UserRole, Payment, AIInsight } from '../types';
import { analyzeRisk } from '../services/geminiService';
import { STATUS_COLORS } from '../constants';

interface LoansListProps {
  loans: Loan[];
  clients: Client[];
  setLoans: React.Dispatch<React.SetStateAction<Loan[]>>;
  userRole: UserRole;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
}

const LoansList: React.FC<LoansListProps> = ({ loans, clients, setLoans, userRole, payments, setPayments }) => {
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);

  const handleStatusChange = (loanId: string, newStatus: LoanStatus) => {
    if (userRole === UserRole.USER && (newStatus === LoanStatus.APPROVED || newStatus === LoanStatus.CLOSED)) {
      alert("Alleen leidinggevenden mogen leningen goedkeuren of afsluiten.");
      return;
    }
    setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: newStatus } : l));
  };

  const runRiskAnalysis = async (loan: Loan) => {
    setIsAnalyzing(true);
    const client = clients.find(c => c.id === loan.clientId)!;
    const insights = await analyzeRisk(loan, client);
    setAiInsights(insights);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <input 
            type="text" 
            placeholder="Zoek lening op nummer of cliënt..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-indigo-500 transition-colors">
          <span>+</span> Nieuwe Lening
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b text-slate-500 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Lening nr.</th>
              <th className="px-6 py-4">Cliënt</th>
              <th className="px-6 py-4">Bedrag</th>
              <th className="px-6 py-4">Rente</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {loans.map(loan => {
              const client = clients.find(c => c.id === loan.clientId);
              return (
                <tr key={loan.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{loan.loanNumber}</td>
                  <td className="px-6 py-4">{client?.name || 'Onbekend'}</td>
                  <td className="px-6 py-4">{loan.currency} {loan.principal.toLocaleString()}</td>
                  <td className="px-6 py-4">{loan.interestRate}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[loan.status]}`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setSelectedLoan(loan);
                          setAiInsights([]);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        Bekijk
                      </button>
                      {loan.status === LoanStatus.CONCEPT && (
                        <button 
                          onClick={() => handleStatusChange(loan.id, LoanStatus.APPROVED)}
                          className="text-green-600 hover:text-green-800 font-semibold"
                        >
                          Keur Goed
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal / Detail View */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Dossier: {selectedLoan.loanNumber}</h3>
                <p className="text-sm text-slate-500">Cliënt: {clients.find(c => c.id === selectedLoan.clientId)?.name}</p>
              </div>
              <button onClick={() => setSelectedLoan(null)} className="text-slate-400 hover:text-slate-600">
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-slate-800 mb-2 border-b pb-1">Lening Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-slate-500">Hoofdsom:</div>
                    <div className="font-semibold">{selectedLoan.currency} {selectedLoan.principal.toLocaleString()}</div>
                    <div className="text-slate-500">Saldo:</div>
                    <div className="font-semibold text-indigo-600">{selectedLoan.currency} {selectedLoan.balance.toLocaleString()}</div>
                    <div className="text-slate-500">Looptijd:</div>
                    <div>{selectedLoan.termMonths} maanden</div>
                    <div className="text-slate-500">Grace Period:</div>
                    <div>{selectedLoan.gracePeriodMonths} maanden</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-2 border-b pb-1">Onderpand</h4>
                  {selectedLoan.collateral.map(c => (
                    <div key={c.id} className="p-3 bg-slate-50 rounded-lg text-sm mb-2">
                      <div className="font-semibold text-slate-700">{c.type}</div>
                      <div className="text-slate-500">{c.description}</div>
                      <div className="mt-1 text-xs text-indigo-600">Expiratie: {c.expiryDate}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: AI Analysis */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-800">✨ AI Risico Analyse</h4>
                  <button 
                    onClick={() => runRiskAnalysis(selectedLoan)}
                    disabled={isAnalyzing}
                    className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-500 transition-colors disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Analyseert...' : 'Start Analyse'}
                  </button>
                </div>

                <div className="space-y-3">
                  {aiInsights.length > 0 ? (
                    aiInsights.map((insight, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border flex gap-3 ${
                        insight.severity === 'HIGH' ? 'bg-red-50 border-red-100' : 
                        insight.severity === 'MEDIUM' ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'
                      }`}>
                        <span className="text-lg">
                          {insight.type === 'RISK' ? '⚠️' : insight.type === 'ALERT' ? '🔔' : '💡'}
                        </span>
                        <div>
                          <p className={`font-bold text-xs uppercase mb-1 ${
                            insight.severity === 'HIGH' ? 'text-red-700' : 
                            insight.severity === 'MEDIUM' ? 'text-amber-700' : 'text-blue-700'
                          }`}>
                            {insight.severity} {insight.type}
                          </p>
                          <p className="text-xs text-slate-700 leading-relaxed">{insight.message}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-slate-400 text-sm">Klik op 'Start Analyse' om Gemini AI het dossier te laten beoordelen op risico's en kansen.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
               <button className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-semibold">Exporteer PDF</button>
               <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-500">Boek Betaling</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansList;
