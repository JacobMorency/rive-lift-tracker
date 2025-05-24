"use client";

const CardActionButtons = () => {
  return (
    <div className="flex gap-2">
      <button className="btn btn-primary">Edit</button>
      <button className="btn btn-error">Delete</button>
    </div>
  );
};

export default CardActionButtons;
