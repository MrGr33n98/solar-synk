import { useState, useEffect } from 'react';
import { Brain } from '../brain';
import { useStackApp } from '../app';

interface Lead {
  id: number;
  installer_id: string;
  supplier_id: number;
  project_description: string;
  project_type?: string;
  estimated_budget?: number;
  location?: string;
  contact_email: string;
  contact_phone?: string;
  preferred_contact_method?: string;
  timeline?: string;
  status: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export default function LeadsManagement() {
  const stackApp = useStackApp();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const brain = new Brain({
    baseUrl: '',
    securityWorker: (securityData) => {
      const token = stackApp.user?.accessToken;
      return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    },
  });

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await brain.request<Lead[]>({
        path: '/routes/leads/received',
        method: 'GET',
      });

      if (response.ok && response.data) {
        setLeads(response.data);
      }
    } catch (err) {
      setError('Erro ao carregar leads');
      console.error('Error loading leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: number, status: string, notes?: string) => {
    try {
      const response = await brain.request({
        path: '/routes/leads/status',
        method: 'PUT',
        body: {
          lead_id: leadId,
          status,
          notes,
        },
      });

      if (response.ok) {
        loadLeads(); // Reload leads after update
      } else {
        setError('Erro ao atualizar status do lead');
      }
    } catch (err) {
      setError('Erro ao atualizar status do lead');
      console.error('Error updating lead status:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'quoted':
        return 'bg-purple-100 text-purple-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Gerenciar Leads</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Solicitações de Orçamento Recebidas</h2>
          <p className="text-sm text-gray-600">
            {leads.length} lead{leads.length !== 1 ? 's' : ''} no total
          </p>
        </div>

        {leads.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Nenhuma solicitação de orçamento recebida ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projeto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orçamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {lead.project_type || 'Projeto solar'}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {lead.project_description}
                        </div>
                        {lead.location && (
                          <div className="text-xs text-gray-400">{lead.location}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{lead.contact_email}</div>
                        {lead.contact_phone && (
                          <div className="text-sm text-gray-500">{lead.contact_phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(lead.estimated_budget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status === 'pending' ? 'Pendente' :
                         lead.status === 'contacted' ? 'Contatado' :
                         lead.status === 'quoted' ? 'Orçado' : 'Fechado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                      >
                        <option value="pending">Pendente</option>
                        <option value="contacted">Contatado</option>
                        <option value="quoted">Orçado</option>
                        <option value="closed">Fechado</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
