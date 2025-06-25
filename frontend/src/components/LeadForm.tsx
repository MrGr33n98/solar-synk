import { useState } from 'react';
import { Brain } from '../brain';
import { useStackApp } from '../app';

interface LeadFormProps {
  supplierId: number;
  supplierName: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface CreateLeadRequest {
  supplier_id: number;
  project_description: string;
  project_type?: string;
  estimated_budget?: number;
  location?: string;
  contact_email: string;
  contact_phone?: string;
  preferred_contact_method?: string;
  timeline?: string;
}

export function LeadForm({ supplierId, supplierName, onClose, onSuccess }: LeadFormProps) {
  const stackApp = useStackApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateLeadRequest>({
    supplier_id: supplierId,
    project_description: '',
    project_type: '',
    estimated_budget: 0,
    location: '',
    contact_email: stackApp.user?.primaryEmail || '',
    contact_phone: '',
    preferred_contact_method: 'email',
    timeline: '',
  });

  const brain = new Brain({
    baseUrl: '',
    securityWorker: (securityData) => {
      const token = stackApp.user?.accessToken;
      return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await brain.request({
        path: '/routes/leads/',
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        setError('Erro ao enviar solicitação de orçamento');
      }
    } catch (err) {
      setError('Erro ao enviar solicitação de orçamento');
      console.error('Error creating lead:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof CreateLeadRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Solicitar Orçamento - {supplierName}</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Descrição do Projeto *
            </label>
            <textarea
              value={formData.project_description}
              onChange={(e) => updateFormData('project_description', e.target.value)}
              required
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Descreva seu projeto em detalhes..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tipo de Projeto
            </label>
            <select
              value={formData.project_type}
              onChange={(e) => updateFormData('project_type', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Selecione o tipo</option>
              <option value="residencial">Residencial</option>
              <option value="comercial">Comercial</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Orçamento Estimado (R$)
            </label>
            <input
              type="number"
              value={formData.estimated_budget || ''}
              onChange={(e) => updateFormData('estimated_budget', parseFloat(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Localização
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => updateFormData('location', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Cidade, Estado"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email de Contato *
            </label>
            <input
              type="email"
              value={formData.contact_email}
              onChange={(e) => updateFormData('contact_email', e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Telefone
            </label>
            <input
              type="tel"
              value={formData.contact_phone}
              onChange={(e) => updateFormData('contact_phone', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Prazo Desejado
            </label>
            <select
              value={formData.timeline}
              onChange={(e) => updateFormData('timeline', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Selecione o prazo</option>
              <option value="urgente">Urgente (até 1 semana)</option>
              <option value="1-mes">1 mês</option>
              <option value="2-3-meses">2-3 meses</option>
              <option value="mais-3-meses">Mais de 3 meses</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.project_description || !formData.contact_email}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar Solicitação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
