import React, { useState, useEffect } from 'react';
import { Brain } from '../brain';
import { useStackApp } from '../app';

interface CompanyWithSubscription {
  id: number;
  name: string;
  email?: string;
  city?: string;
  state?: string;
  current_plan?: string;
  plan_status?: string;
}

interface Plan {
  id: number;
  name: string;
  description?: string;
  price: number;
  billing_cycle: string;
}

export default function AdminPanel() {
  const stackApp = useStackApp();
  const [companies, setCompanies] = useState<CompanyWithSubscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
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
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [companiesResponse, plansResponse] = await Promise.all([
        brain.request<CompanyWithSubscription[]>({
          path: '/routes/admin/companies',
          method: 'GET',
        }),
        brain.request<Plan[]>({
          path: '/routes/admin/plans',
          method: 'GET',
        }),
      ]);

      if (companiesResponse.ok && companiesResponse.data) {
        setCompanies(companiesResponse.data);
      }
      if (plansResponse.ok && plansResponse.data) {
        setPlans(plansResponse.data);
      }
    } catch (err) {
      setError('Erro ao carregar dados do painel administrativo');
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid #ccc', borderTop: '2px solid #007bff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px' }}>Painel Administrativo</h1>
      
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Empresas */}
        <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>Empresas Cadastradas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {companies.map((company) => (
              <div key={company.id} style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '16px' }}>
                <div style={{ fontWeight: '500' }}>{company.name}</div>
                {company.email && (
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{company.email}</div>
                )}
                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem' }}>
                    Plano: {company.current_plan || 'Nenhum'}
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    background: company.plan_status === 'active' ? '#dcfce7' : '#f3f4f6',
                    color: company.plan_status === 'active' ? '#166534' : '#374151'
                  }}>
                    {company.plan_status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Planos */}
        <div style={{ background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>Planos Disponíveis</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {plans.map((plan) => (
              <div key={plan.id} style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>{plan.name}</div>
                    {plan.description && (
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '4px' }}>{plan.description}</div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '600' }}>{formatPrice(plan.price)}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {plan.billing_cycle === 'monthly' ? 'mensal' : 'anual'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
