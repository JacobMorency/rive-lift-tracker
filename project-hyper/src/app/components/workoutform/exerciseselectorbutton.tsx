import { Exercise } from "@/types/workout";
import { Star, StarOff } from "lucide-react";

type ExerciseSelectorButtonProps = {
  exercise: Exercise;
  handleSelect: (exercise: Exercise) => void;
  addToRecent: (exercise: Exercise) => void;
  isFavorite: boolean;
  onToggleFavorite: (exercise: Exercise) => void;
  isDisabled?: boolean;
  isSelected?: boolean;
};

const ExerciseSelectorButton = ({
  exercise,
  handleSelect,
  addToRecent,
  isFavorite,
  onToggleFavorite,
  isDisabled = false,
  isSelected = false,
}: ExerciseSelectorButtonProps) => {
  return (
    <button
      className={`btn btn-xl my-1 w-full relative py-4 ${
        isDisabled
          ? "btn-disabled opacity-50 cursor-not-allowed"
          : isSelected
          ? "btn-success"
          : "btn-primary"
      }`}
      type="button"
      disabled={isDisabled}
      onClick={() => {
        if (!isDisabled) {
          handleSelect(exercise);
          // Only close modal if it's the exercise selector modal
          const modal = document.getElementById(
            "exercise_modal"
          ) as HTMLDialogElement;
          if (modal) {
            modal.close();
          }
          addToRecent(exercise);
        }
      }}
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex items-start gap-2 text-left flex-1 min-w-0">
          <span className="break-words leading-tight">{exercise.name}</span>
        </div>
        {!isDisabled && (
          <div className="flex-shrink-0 ml-2 mt-0.5">
            {isFavorite ? (
              <Star
                size={20}
                fill="currentColor"
                className="text-yellow-500 transition-all duration-200 ease-in-out hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents modal from closing
                  onToggleFavorite(exercise);
                }}
              />
            ) : (
              <StarOff
                size={20}
                className="text-gray-400 transition-all duration-200 ease-in-out hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents modal from closing
                  onToggleFavorite(exercise);
                }}
              />
            )}
          </div>
        )}
      </div>
    </button>
  );
};

export default ExerciseSelectorButton;
