import { useParams, Navigate } from "react-router-dom";
import BowlingJaen from "./prototypes/BowlingJaen";
import BowlingMadrid from "./prototypes/BowlingMadrid";
import BowlingBarcelona from "./prototypes/BowlingBarcelona";
import BowlingSegovia from "./prototypes/BowlingSegovia";
import BowlingCadiz from "./prototypes/BowlingCadiz";
import BowlingBaseline from "./prototypes/BowlingBaseline";

const PrototypeRouter = () => {
  const { prototypeId, calendarType } = useParams<{ prototypeId: string; calendarType: string }>();

  // Mapeo de IDs de prototipos a componentes
  const prototypeComponents = {
    jaen: BowlingJaen,
    madrid: BowlingMadrid,
    barcelona: BowlingBarcelona,
    segovia: BowlingSegovia,
    cadiz: BowlingCadiz,
    baseline: BowlingBaseline,
  };

  // Verificar si el prototipo existe
  if (!prototypeId || !(prototypeId in prototypeComponents)) {
    return <Navigate to="/" replace />;
  }

  // Verificar si el tipo de calendario es válido
  if (!calendarType || !['big-calendar', 'small-calendar'].includes(calendarType)) {
    return <Navigate to="/" replace />;
  }

  // Determinar el tipo de calendario
  const isSmallCalendar = calendarType === 'small-calendar';

  // Obtener el componente correspondiente
  const PrototypeComponent = prototypeComponents[prototypeId as keyof typeof prototypeComponents];

  // Renderizar el prototipo con la prop del calendario
  return <PrototypeComponent calendarType={isSmallCalendar ? 'small' : 'big'} />;
};

export default PrototypeRouter; 