
import React, { useState, useEffect } from 'react';
import { Loan, Client, LoanStatus } from '../types';
import { generateManagementSummary } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  loans: Loan[];
  clients: Client[];
}

const Dashboard: React.FC<DashboardProps> = ({ loans, clients }) => {
  const [aiSummary, setAiSummary] = useState<string>('Analyseren van gegevens...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      const summary = await generateManagementSummary(loans);
      setAiSummary(summary);
      setLoading(false);
    };
    fetchSummary();
  }, [loans]);

  const totalOutstanding = loans.reduce((acc, l) => acc + l.balance, 0);
  const lateLoans = loans.filter(l => l.status === LoanStatus.LATE).length;
  const conceptLoans = loans.filter(l => l.status === LoanStatus.CONCEPT).length;

  const chartData = [
    { name: 'Goedgekeurd', value: loans.filter(l => l.status === LoanStatus.APPROVED).length },
    { name: 'Concept', value: conceptLoans },
    { name: 'Achterstand', value: lateLoans },
  ];

  const COLORS = ['#4f46e5', '#94a3b8', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Totaal Uitstaand</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-800">€{totalOutstanding.toLocaleString()}</h3>
          <div className="mt-2 text-xs text-green-600 font-semibold">+2.5% deze maand</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Actieve Leningen</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-800">{loans.length}</h3>
          <div className="mt-2 text-xs text-slate-400 font-medium">Over {clients.length} cliënten</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">In Achterstand</p>
          <h3 className="text-2xl font-bold mt-1 text-red-600">{lateLoans}</h3>
          <div className="mt-2 text-xs text-red-500 font-semibold">Actie vereist</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Nieuwe Aanvragen</p>
          <h3 className="text-2xl font-bold mt-1 text-slate-800">{conceptLoans}</h3>
          <div className="mt-2 text-xs text-indigo-600 font-semibold">Wachtend op goedkeuring</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Lening Portefeuille Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Card */}
        <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-md border border-indigo-800 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">✨</span>
            <h3 className="text-lg font-bold">AI Management Inzicht</h3>
          </div>
          <div className="flex-1 bg-indigo-950/50 rounded-lg p-4 text-slate-200 text-sm leading-relaxed overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                <p>AI analyseert uw portefeuille...</p>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{aiSummary}</div>
            )}
          </div>
          <button 
            onClick={() => generateManagementSummary(loans).then(setAiSummary)}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-semibold text-sm transition-colors"
          >
            Vernieuw Analyse
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
