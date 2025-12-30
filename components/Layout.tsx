
import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, userRole, setUserRole }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'loans', label: 'Leningen', icon: '📑' },
    { id: 'clients', label: 'Cliënten', icon: '👥' },
    { id: 'reports', label: 'Rapportages', icon: '📈' },
    { id: 'settings', label: 'Instellingen', icon: '⚙️' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl">L</div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">LendAI</h1>
            <p className="text-xs text-slate-400">Loan Management</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Uw Rol</div>
          <select 
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as UserRole)}
            className="w-full bg-slate-800 border-none rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500"
          >
            <option value={UserRole.USER}>Gebruiker</option>
            <option value={UserRole.MANAGER}>Leidinggevende</option>
            <option value={UserRole.ADMIN}>Beheerder</option>
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Welkom, {userRole}</span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
              {userRole.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
