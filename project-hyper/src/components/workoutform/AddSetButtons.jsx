import { Button } from "@/components/ui/button";

const AddSetButtons = ({
  isSetUpdating,
  handleAddSet,
  handleSaveUpdatedSet,
  cancelUpdateSet,
  updateSetIndex,
}) => {
  return (
    <div>
      {!isSetUpdating && (
        <Button className="w-full" onClick={handleAddSet} type="button">
          Add Set
        </Button>
      )}
      {isSetUpdating && (
        <div className="flex flex-col space-y-1">
          <Button
            className="w-full"
            onClick={handleSaveUpdatedSet}
            type="button"
          >
            Update Set {updateSetIndex + 1}
          </Button>
          <Button
            className="w-full bg-clear border hover:bg-neutral-300 text-black"
            type="button"
            onClick={cancelUpdateSet}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddSetButtons;
