import React from 'react';

export default function Table({
  children,
  className = '',
  striped = false,
  hover = false,
  ...props
}) {
  const baseStyle = 'w-full border-collapse text-sm';
  const stripedStyle = striped ? 'divide-y divide-gray-200' : '';
  const hoverStyle = hover ? '[&_tbody_tr:hover]:bg-gray-50' : '';

  return (
    <div className="overflow-x-auto">
      <table
        className={`${baseStyle} ${stripedStyle} ${hoverStyle} ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className = '', ...props }) {
  return (
    <thead className={className} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '', ...props }) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '', ...props }) {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
}

export function TableHeader({ children, className = '', ...props }) {
  return (
    <th className={`text-left py-3 px-4 font-medium text-gray-500 ${className}`} {...props}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = '', ...props }) {
  return (
    <td className={`py-3 px-4 text-gray-600 ${className}`} {...props}>
      {children}
    </td>
  );
}
