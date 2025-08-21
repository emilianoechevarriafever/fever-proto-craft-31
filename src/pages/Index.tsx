import { useState } from "react";
import { Star, MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppBar from "@/components/AppBar";
import BookingWizard from "@/components/BookingWizard";
import bowling1 from "@/assets/bowling1.jpg";

const Index = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppBar />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="relative h-64 overflow-hidden">
          <img 
            src={bowling1} 
            alt="Bowling alley interior" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Hero Content */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h1 className="fever-h1 text-white mb-2">Bowling Madrid Centro</h1>
            <div className="flex items-center gap-4 fever-body2">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Madrid Centro</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>4.8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card - Overlapping Hero */}
        <div className="fever-card mx-5 -mt-8 relative z-10 p-5 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-primary" />
              <div>
                <div className="fever-body1 font-semibold">Horarios</div>
                <div className="fever-body2">Lun-Dom: 12:00 - 22:00</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <div className="fever-body1 font-semibold">Capacidad</div>
                <div className="fever-body2">Hasta 6 personas por pista</div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="fever-body1 mb-3">
              Disfruta de una experiencia única de bowling en el corazón de Madrid. 
              Pistas modernas con sistema de puntuación automático y ambiente vibrante.
            </div>
            
            <div className="space-y-2">
              <div className="fever-body2">
                <span className="font-semibold">Incluye:</span> Alquiler de zapatos, pista reservada
              </div>
              <div className="fever-body2">
                <span className="font-semibold">Desde:</span> 12€ por persona
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Sections */}
      <div className="p-5 space-y-6 pt-8">
        {/* Features */}
        <div className="space-y-4">
          <h2 className="fever-h2">¿Qué incluye?</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="fever-card p-4 text-center">
              <div className="text-2xl mb-2">🎳</div>
              <div className="fever-body2 font-semibold">Pista privada</div>
              <div className="fever-caption">Hasta 2 horas</div>
            </div>
            <div className="fever-card p-4 text-center">
              <div className="text-2xl mb-2">👟</div>
              <div className="fever-body2 font-semibold">Zapatos incluidos</div>
              <div className="fever-caption">Todas las tallas</div>
            </div>
            <div className="fever-card p-4 text-center">
              <div className="text-2xl mb-2">📱</div>
              <div className="fever-body2 font-semibold">Sistema digital</div>
              <div className="fever-caption">Puntuación automática</div>
            </div>
            <div className="fever-card p-4 text-center">
              <div className="text-2xl mb-2">🎵</div>
              <div className="fever-body2 font-semibold">Ambiente único</div>
              <div className="fever-caption">Música y luces</div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h2 className="fever-h2">Precios</h2>
          <div className="space-y-3">
            <div className="fever-card p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="fever-body1 font-semibold">1 Partida</div>
                  <div className="fever-body2">Aproximadamente 20 minutos</div>
                </div>
                <div className="text-right">
                  <div className="fever-h2 text-primary">12€</div>
                  <div className="fever-caption">por persona</div>
                </div>
              </div>
            </div>
            
            <div className="fever-card p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="fever-body1 font-semibold">2 Partidas</div>
                  <div className="fever-body2">Aproximadamente 40 minutos</div>
                </div>
                <div className="text-right">
                  <div className="fever-h2 text-primary">20€</div>
                  <div className="fever-caption">por persona</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-5 z-30">
        <Button
          onClick={() => setIsBookingOpen(true)}
          className="w-full bg-primary hover:bg-primary-300 text-white fever-pill-button h-14 text-lg font-semibold shadow-[var(--elevation-02)]"
        >
          Tickets
        </Button>
      </div>

      {/* Booking Wizard */}
      <BookingWizard 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
      
      {/* Bottom padding for sticky CTA */}
      <div className="h-24" />
    </div>
  );
};

export default Index;
