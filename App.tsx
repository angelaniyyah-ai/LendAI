
import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, Loan, Client, LoanStatus, LoanType, OwnershipType, Payment } from './types';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import LoansList from './views/LoansList';
import ClientsList from './views/ClientsList';
import Reports from './views/Reports';
import Settings from './views/Settings';

// Mock Data Initializer
const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Jan Jansen', email: 'jan@example.com', phone: '012345678', address: 'Hoofdstraat 1' },
  { id: 'c2', name: 'Maria Smit', email: 'maria@example.com', phone: '087654321', address: 'Kerkplein 5' },
];

const MOCK_LOANS: Loan[] = [
  {
    id: 'l1',
    loanNumber: '2024-0001',
    clientId: 'c1',
    principal: 250000,
    interestRate: 4.5,
    type: LoanType.ANNUITY,
    status: LoanStatus.APPROVED,
    startDate: '2024-01-01',
    termMonths: 360,
    currency: 'EUR',
    gracePeriodMonths: 0,
    collateral: [{ id: 'col1', type: OwnershipType.OWNERSHIP, description: 'Woonhuis Hoofdstraat', expiryDate: '2050-01-01', parcelNumbers: ['A123'] }],
    balance: 248500,
    notes: ['Goedgekeurd door manager'],
  },
  {
    id: 'l2',
    loanNumber: '2024-0002',
    clientId: 'c2',
    principal: 50000,
    interestRate: 6.0,
    type: LoanType.INTEREST_ONLY,
    status: LoanStatus.LATE,
    startDate: '2024-02-15',
    termMonths: 60,
    currency: 'USD',
    gracePeriodMonths: 3,
    collateral: [{ id: 'col2', type: OwnershipType.LAND_LEASE, description: 'Perceel Buitenwijk', expiryDate: '2030-12-31', parcelNumbers: ['B456'] }],
    balance: 51200,
    notes: ['Achterstand in betaling'],
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.MANAGER);
  const [loans, setLoans] = useState<Loan[]>(MOCK_LOANS);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Simulation of persistence (Local storage would be here)
  useEffect(() => {
    const savedRole = localStorage.getItem('lendai_role');
    if (savedRole) setUserRole(savedRole as UserRole);
  }, []);

  const handleUpdateRole = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem('lendai_role', role);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard loans={loans} clients={clients} />;
      case 'loans':
        return <LoansList 
          loans={loans} 
          clients={clients} 
          setLoans={setLoans} 
          userRole={userRole} 
          payments={payments}
          setPayments={setPayments}
        />;
      case 'clients':
        return <ClientsList clients={clients} setClients={setClients} />;
      case 'reports':
        return <Reports loans={loans} payments={payments} />;
      case 'settings':
        return <Settings userRole={userRole} />;
      default:
        return <Dashboard loans={loans} clients={clients} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      userRole={userRole} 
      setUserRole={handleUpdateRole}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
