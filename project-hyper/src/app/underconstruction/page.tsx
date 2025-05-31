import Link from "next/link";

const UnderConstruction = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="mb-3">This page is currently a work in progress.</p>
        <Link href="/login" className="btn btn-primary">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default UnderConstruction;
