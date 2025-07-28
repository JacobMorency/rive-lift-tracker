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
      className={`btn my-1 w-full relative ${
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
      {exercise.name}
      {!isDisabled && (
        <div className="absolute right-2">
          {isFavorite ? (
            <Star
              size={20}
              fill="currentColor"
              className="text-yellow-500"
              onClick={(e) => {
                e.stopPropagation(); // Prevents modal from closing
                onToggleFavorite(exercise);
              }}
            />
          ) : (
            <StarOff
              size={20}
              className="text-gray-400"
              onClick={(e) => {
                e.stopPropagation(); // Prevents modal from closing
                onToggleFavorite(exercise);
              }}
            />
          )}
        </div>
      )}
    </button>
  );
};

export default ExerciseSelectorButton;
