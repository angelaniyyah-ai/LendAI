
export enum UserRole {
  USER = 'USER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN'
}

export enum LoanType {
  ANNUITY = 'ANNUITY',
  INTEREST_ONLY = 'INTEREST_ONLY'
}

export enum LoanStatus {
  CONCEPT = 'CONCEPT',
  APPROVED = 'APPROVED',
  CLOSED = 'CLOSED',
  LATE = 'LATE'
}

export enum OwnershipType {
  OWNERSHIP = 'Eigendom',
  LAND_LEASE = 'Grondhuur',
  LEASEHOLD = 'Erfpacht'
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Collateral {
  id: string;
  type: OwnershipType;
  description: string;
  expiryDate: string;
  parcelNumbers: string[];
}

export interface Loan {
  id: string;
  loanNumber: string; // format YYYY-XXXX
  externalId?: string;
  clientId: string;
  principal: number;
  interestRate: number;
  type: LoanType;
  status: LoanStatus;
  startDate: string;
  termMonths: number;
  currency: string;
  gracePeriodMonths: number;
  collateral: Collateral[];
  balance: number;
  notes: string[];
}

export interface Payment {
  id: string;
  loanId: string;
  date: string;
  amount: number;
  type: 'PRINCIPAL' | 'INTEREST' | 'FEE' | 'PENALTY';
  method: 'CASH' | 'BANK';
}

export interface ExchangeRate {
  currency: string;
  rate: number;
  updatedAt: string;
}

export interface AIInsight {
  type: 'RISK' | 'ALERT' | 'OPPORTUNITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  message: string;
  loanId?: string;
}
