import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Eye, Users, DollarSign, Loader2, MessageSquare, Clock } from "lucide-react";
import brain from 'brain';
import type { AnalyticsData } from 'brain/data-contracts';
import { useUserGuardContext } from 'app/auth';

export default function DashboardPage() {
  const { user } = useUserGuardContext(); // Ensures user is logged in
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await brain.get_analytics();
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to fetch analytics");
        }
      } catch (err: any) {
        console.error("Error fetching analytics:", err);
        setError(err.message || "An unexpected error occurred.");
      }
      setLoading(false);
    };

    fetchAnalytics();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-destructive font-semibold">Oops! Algo deu errado.</p>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }
  
  if (!analytics) {
      return null;
  }

  const formattedDailyViews = analytics.daily_views.map(item => ({
      ...item,
      date: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
  }));


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard do Fornecedor</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard icon={<Users className="h-6 w-6 text-primary"/>} title="Visitantes Totais" value={analytics.total_views.toLocaleString()} />
        <MetricCard icon={<Eye className="h-6 w-6 text-blue-500"/>} title="Visitas (Últimos 30d)" value={analytics.views_past_30_days.toLocaleString()} />
        <MetricCard icon={<DollarSign className="h-6 w-6 text-green-500"/>} title="Leads Gerados" value="0" description="Funcionalidade em breve"/>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visualizações do Perfil (Últimos 30 Dias)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={formattedDailyViews}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))'
                  }}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Legend />
                <Area type="monotone" dataKey="views" name="Visualizações" stroke="hsl(var(--primary))" fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

const MetricCard = ({ icon, title, value, description }: { icon: React.ReactNode, title: string, value: string, description?: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
       {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </CardContent>
  </Card>
)