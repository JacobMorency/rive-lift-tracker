const PageHeader = ({ heading }) => {
  return (
    <header className="border-b-2 border-gray-200 py-4">
      <h1 className="font-bold text-3xl px-4">{heading}</h1>
    </header>
  );
};

export default PageHeader;
