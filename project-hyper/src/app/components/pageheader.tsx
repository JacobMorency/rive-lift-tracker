"use client";

type PageHeaderProps = {
  heading: string;
  subtitle?: string;
  action?: React.ReactNode;
};

const PageHeader = ({ heading, subtitle, action }: PageHeaderProps) => {
  return (
    <header className="bg-base-100 border-b border-base-300 px-4 py-6 safe-top">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-base-content mb-1">
            {heading}
          </h1>
          {subtitle && (
            <p className="text-sm text-base-content/60 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0 ml-4">{action}</div>}
      </div>
    </header>
  );
};

export default PageHeader;
