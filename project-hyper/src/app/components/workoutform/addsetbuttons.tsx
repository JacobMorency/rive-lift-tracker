import { NullableNumber } from "@/types/workout";

export type AddSetButtonProps = {
  isSetUpdating: boolean;
  handleAddSet: () => void;
  handleSaveUpdatedSet: () => void;
  cancelUpdateSet: () => void;
  updateSetIndex: NullableNumber;
};

const AddSetButtons = ({
  isSetUpdating,
  handleAddSet,
  handleSaveUpdatedSet,
  cancelUpdateSet,
  updateSetIndex,
}: AddSetButtonProps) => {
  return (
    <div>
      {!isSetUpdating && (
        <button
          className="w-full btn btn-primary"
          onClick={handleAddSet}
          type="button"
        >
          Add Set
        </button>
      )}
      {isSetUpdating && (
        <div className="flex flex-col space-y-1">
          <button
            className="w-full btn btn-primary"
            onClick={handleSaveUpdatedSet}
            type="button"
          >
            {updateSetIndex !== null && `Update Set ${updateSetIndex + 1}`}
          </button>
          <button
            className="w-full btn btn-error"
            type="button"
            onClick={cancelUpdateSet}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AddSetButtons;
