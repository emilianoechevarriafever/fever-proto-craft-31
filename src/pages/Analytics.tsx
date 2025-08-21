import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, Users, MousePointer, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useMixpanelAnalytics } from "@/hooks/use-mixpanel-analytics";

const Analytics = () => {
  const navigate = useNavigate();
  const { getStats, getEvents } = useMixpanelAnalytics();
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const updateStats = () => {
      const jaenStats = getStats('jaen');
      const madridStats = getStats('madrid');
      const barcelonaStats = getStats('barcelona');
      
      setStats({
        jaen: jaenStats,
        madrid: madridStats,
        barcelona: barcelonaStats,
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [getStats]);

  const prototypes = [
    { id: 'jaen', name: 'Bowling Jaén', color: 'bg-green-500' },
    { id: 'madrid', name: 'Bowling Madrid', color: 'bg-blue-500' },
    { id: 'barcelona', name: 'Bowling Barcelona', color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analíticas de Prototipos</h1>
              <p className="text-gray-600">Métricas de uso en tiempo real</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {prototypes.map((prototype) => {
            const prototypeStats = stats[prototype.id] || {
              pageViews: 0,
              bookings: 0,
              completions: 0,
              conversionRate: 0,
              completionRate: 0,
            };

            return (
              <Card key={prototype.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 ${prototype.color} rounded-full`}></div>
                    <CardTitle className="text-lg">{prototype.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <MousePointer className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-600">Vistas</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {prototypeStats.pageViews}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-600">Reservas</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {prototypeStats.bookings}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Tasa de conversión</span>
                      <span className="text-sm font-semibold text-green-600">
                        {prototypeStats.conversionRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completaciones</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {prototypeStats.completions}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* URL Sharing Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              URLs para Compartir
            </CardTitle>
            <CardDescription>
              Comparte estas URLs específicas para que los usuarios prueben cada prototipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {prototypes.map((prototype) => (
                <div key={prototype.id} className="flex items-center gap-4">
                  <div className={`w-3 h-3 ${prototype.color} rounded-full flex-shrink-0`}></div>
                  <div className="flex-1">
                    <div className="font-medium">{prototype.name}</div>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {window.location.origin}/prototype/{prototype.id}
                    </code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/prototype/${prototype.id}`
                      );
                    }}
                  >
                    Copiar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Events */}
        <Card>
          <CardHeader>
            <CardTitle>Eventos Recientes</CardTitle>
            <CardDescription>
              Últimos eventos registrados en tiempo real
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {getEvents().slice(-10).reverse().map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  <div className={`w-2 h-2 ${
                    event.prototypeId === 'jaen' ? 'bg-green-500' :
                    event.prototypeId === 'madrid' ? 'bg-blue-500' :
                    event.prototypeId === 'barcelona' ? 'bg-red-500' : 'bg-gray-400'
                  } rounded-full`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{event.event}</div>
                    <div className="text-xs text-gray-500">
                      {event.prototypeId ? `${event.prototypeId} • ` : ''}
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics; 