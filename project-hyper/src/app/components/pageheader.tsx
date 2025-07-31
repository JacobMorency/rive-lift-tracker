"use client";

type PageHeaderProps = {
  heading: string;
  subtitle?: string;
  action?: React.ReactNode;
};

const PageHeader = ({ heading, subtitle, action }: PageHeaderProps) => {
  return (
    <header className="bg-base-100 border-b border-base-300 px-4 py-3 safe-top">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-base-content">{heading}</h1>
          {subtitle && (
            <p className="text-xs text-base-content/60 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0 ml-3">{action}</div>}
      </div>
    </header>
  );
};

export default PageHeader;
