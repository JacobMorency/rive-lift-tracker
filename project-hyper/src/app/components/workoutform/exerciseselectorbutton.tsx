import { Exercise } from "@/types/workout";
import { Star, StarOff } from "lucide-react";

type ExerciseSelectorButtonProps = {
  exercise: Exercise;
  handleSelect: (exercise: Exercise) => void;
  addToRecent: (exercise: Exercise) => void;
  isFavorite: boolean;
  onToggleFavorite: (exercise: Exercise) => void;
  isDisabled?: boolean;
};

const ExerciseSelectorButton = ({
  exercise,
  handleSelect,
  addToRecent,
  isFavorite,
  onToggleFavorite,
  isDisabled = false,
}: ExerciseSelectorButtonProps) => {
  return (
    <button
      className={`btn btn-xl my-1 w-full relative py-4 ${
        isDisabled
          ? "btn-disabled opacity-50 cursor-not-allowed"
          : "btn-primary"
      }`}
      type="button"
      disabled={isDisabled}
      onClick={() => {
        if (!isDisabled) {
          handleSelect(exercise);
          (
            document.getElementById("exercise_modal") as HTMLDialogElement
          )?.close();
          addToRecent(exercise);
        }
      }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {exercise.name}
          {isFavorite && (
            <Star size={12} fill="currentColor" className="text-yellow-500" />
          )}
        </div>
        {!isDisabled && (
          <div>
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
