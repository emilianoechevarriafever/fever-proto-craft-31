interface GameCardProps {
  title: string;
  subtitle: string;
  price: string;
  isSelected: boolean;
  onClick: () => void;
}

const GameCard = ({ title, subtitle, price, isSelected, onClick }: GameCardProps) => {
  return (
    <button
      className={`fever-game-card w-full text-left ${
        isSelected ? "fever-game-card-selected" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="fever-body1 font-semibold">{title}</div>
          <div className="fever-body2">{subtitle}</div>
        </div>
        <div className="text-right">
          <div className="fever-body1 font-semibold text-neutral-900">{price}</div>
        </div>
      </div>
    </button>
  );
};

export default GameCard;