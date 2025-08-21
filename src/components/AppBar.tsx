import { Search, MapPin, Globe, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import feverLogo from "@/assets/fever-logo.png";

const AppBar = () => {
  return (
    <header className="bg-white shadow-[var(--elevation-01)] px-5 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center">
        <img 
          src={feverLogo} 
          alt="Fever" 
          className="h-6 w-auto"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="w-6 h-6">
          <Search className="w-5 h-5 text-neutral-700" />
        </Button>
        <Button variant="ghost" size="icon" className="w-6 h-6">
          <MapPin className="w-5 h-5 text-neutral-700" />
        </Button>
        <Button variant="ghost" className="h-6 px-2 text-sm font-medium text-neutral-700">
          <Globe className="w-4 h-4 mr-1" />
          EN
        </Button>
        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-amber-600">
          <span className="text-white text-sm font-medium">A</span>
        </Button>
        <Button variant="ghost" size="icon" className="w-6 h-6 md:hidden">
          <Menu className="w-5 h-5 text-neutral-700" />
        </Button>
      </div>
    </header>
  );
};

export default AppBar;