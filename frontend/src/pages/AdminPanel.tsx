import { useState, useEffect } from 'react';
import { Brain } from '../brain';
import { useStackApp } from '../app';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../extensions/shadcn/components/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../extensions/shadcn/components/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../extensions/shadcn/components/table';
import { Button } from '../extensions/shadcn/components/button';
import { Input } from '../extensions/shadcn/components/input';
import { Badge } from '../extensions/shadcn/components/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../extensions/shadcn/components/dialog';
import { Label } from '../extensions/shadcn/components/label';
import { Textarea } from '../extensions/shadcn/components/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../extensions/shadcn/components/tabs';
import { AlertCircle, Plus, Settings, Users, CreditCard } from 'lucide-react';
import { Alert, AlertDescription } from '../extensions/shadcn/components/alert';

interface CompanyWithSubscription {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  website?: string;
  current_plan?: string;
  plan_status?: string;
  subscription_start?: string;
  subscription_end?: string;
}

interface Plan {
  id: number;
  name: string;
  description?: string;
  price: number;
  billing_cycle: string;
  max_products?: number;
  max_users?: number;
  features?: string;
  created_at?: string;
}

interface CreatePlanRequest {
  name: string;
  description?: string;
  price: number;
  billing_cycle: string;
  max_products?: number;
  max_users?: number;
  features?: string;
}

export default function AdminPanel() {
  const stackApp = useStackApp();
  const [companies, setCompanies] = useState<CompanyWithSubscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<CompanyWithSubscription | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState<CreatePlanRequest>({
    name: '',
    description: '',
    price: 0,
    billing_cycle: 'monthly',
    max_products: 0,
    max_users: 0,
    features: '',
  });

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

  const handleUpdateSubscription = async () => {
    if (!selectedCompany || !selectedPlan) return;

    try {
      const response = await brain.request({
        path: '/routes/admin/subscriptions',
        method: 'PUT',
        body: {
          company_id: selectedCompany.id,
          plan_id: parseInt(selectedPlan),
        },
      });

      if (response.ok) {
        setIsSubscriptionDialogOpen(false);
        loadData();
        setSelectedCompany(null);
        setSelectedPlan('');
      } else {
        setError('Erro ao atualizar plano da empresa');
      }
    } catch (err) {
      setError('Erro ao atualizar plano da empresa');
      console.error('Error updating subscription:', err);
    }
  };

  const handleCreatePlan = async () => {
    try {
      const response = await brain.request({
        path: '/routes/admin/plans',
        method: 'POST',
        body: newPlan,
      });

      if (response.ok) {
        setIsPlanDialogOpen(false);
        loadData();
        setNewPlan({
          name: '',
          description: '',
          price: 0,
          billing_cycle: 'monthly',
          max_products: 0,
          max_users: 0,
          features: '',
        });
      } else {
        setError('Erro ao criar novo plano');
      }
    } catch (err) {
      setError('Erro ao criar novo plano');
      console.error('Error creating plan:', err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
        <div className="flex space-x-2">
          <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Plano
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Criar Novo Plano</DialogTitle>
                <DialogDescription>
                  Crie um novo plano de assinatura para as empresas.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Descrição
                  </Label>
                  <Textarea
                    id="description"
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Preço
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="billing" className="text-right">
                    Ciclo
                  </Label>
                  <Select
                    value={newPlan.billing_cycle}
                    onValueChange={(value) => setNewPlan({ ...newPlan, billing_cycle: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreatePlan}>Criar Plano</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="companies" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Empresas
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Planos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Empresas e Assinaturas</CardTitle>
              <CardDescription>
                Visualize e gerencie os planos de assinatura das empresas cadastradas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Plano Atual</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{company.name}</div>
                          {company.email && (
                            <div className="text-sm text-gray-500">{company.email}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {company.city && company.state
                          ? `${company.city}, ${company.state}`
                          : 'Não informado'}
                      </TableCell>
                      <TableCell>
                        {company.current_plan || 'Nenhum plano'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(company.plan_status)}>
                          {company.plan_status === 'active' ? 'Ativo' :
                           company.plan_status === 'inactive' ? 'Inativo' :
                           company.plan_status === 'cancelled' ? 'Cancelado' : 'Sem plano'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCompany(company);
                            setIsSubscriptionDialogOpen(true);
                          }}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Alterar Plano
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    <Badge variant="outline">
                      {formatPrice(plan.price)}/{plan.billing_cycle === 'monthly' ? 'mês' : 'ano'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {plan.max_products && (
                      <div>Máx. produtos: {plan.max_products === -1 ? 'Ilimitado' : plan.max_products}</div>
                    )}
                    {plan.max_users && (
                      <div>Máx. usuários: {plan.max_users === -1 ? 'Ilimitado' : plan.max_users}</div>
                    )}
                    {plan.features && (
                      <div className="mt-2">
                        <div className="font-medium">Recursos:</div>
                        <div className="text-gray-600">{plan.features}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isSubscriptionDialogOpen} onOpenChange={setIsSubscriptionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Plano de Assinatura</DialogTitle>
            <DialogDescription>
              Altere o plano de assinatura da empresa {selectedCompany?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="plan" className="text-right">
                Novo Plano
              </Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id.toString()}>
                      {plan.name} - {formatPrice(plan.price)}/{plan.billing_cycle === 'monthly' ? 'mês' : 'ano'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpdateSubscription}
              disabled={!selectedPlan}
            >
              Confirmar Alteração
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
