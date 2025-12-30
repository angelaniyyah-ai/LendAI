
import React from 'react';
import { Client } from '../types';

interface ClientsListProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}

const ClientsList: React.FC<ClientsListProps> = ({ clients, setClients }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800">Cliënten Bestand</h3>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-500 transition-colors text-sm">
          Cliënt Toevoegen
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <div key={client.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-300 transition-colors group">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors font-bold text-lg">
                {client.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{client.name}</h4>
                <p className="text-xs text-slate-400">Cliënt ID: {client.id}</p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-5">📧</span> {client.email}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5">📞</span> {client.phone}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5">🏠</span> {client.address}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex gap-2">
              <button className="flex-1 py-2 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">Dossier Openen</button>
              <button className="flex-1 py-2 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Bewerken</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsList;
