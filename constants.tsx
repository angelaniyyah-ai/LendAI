
import React from 'react';

export const CURRENCIES = ['EUR', 'USD', 'SRD'];

export const INITIAL_EXCHANGE_RATES = [
  { currency: 'USD', rate: 1.0, updatedAt: new Date().toISOString() },
  { currency: 'EUR', rate: 0.9245, updatedAt: new Date().toISOString() },
  { currency: 'SRD', rate: 38.542312, updatedAt: new Date().toISOString() },
];

export const STATUS_COLORS = {
  CONCEPT: 'bg-gray-100 text-gray-700',
  APPROVED: 'bg-green-100 text-green-700',
  CLOSED: 'bg-blue-100 text-blue-700',
  LATE: 'bg-red-100 text-red-700',
};
