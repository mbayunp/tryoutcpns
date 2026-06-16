import React from 'react';

export default function Card({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl ring-1 ring-slate-200/60 shadow-premium transition-all duration-300 ease-out ${
        hover ? 'hover:-translate-y-1 hover:shadow-premium-hover hover:ring-slate-300/60' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`border-b border-slate-100/80 pb-4 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '', ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`border-t border-slate-100/80 pt-4 mt-4 ${className}`} {...props}>
      {children}
    </div>
  );
};
