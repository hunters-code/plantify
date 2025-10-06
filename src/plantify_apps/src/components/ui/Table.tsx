import React from "react";

type TableProps = React.TableHTMLAttributes<HTMLTableElement> & {
  className?: string;
  striped?: boolean;
  hover?: boolean;
  children: React.ReactNode;
};

export default function Table({
  children,
  className = "",
  striped = false,
  hover = false,
  ...props
}: TableProps) {
  const baseStyle = "w-full border-collapse text-sm";
  const stripedStyle = striped ? "divide-y divide-gray-200" : "";
  const hoverStyle = hover ? "[&_tbody_tr:hover]:bg-gray-50" : "";

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

type TableSectionProps<T extends HTMLElement> = React.HTMLAttributes<T> & {
  className?: string;
  children: React.ReactNode;
};

export function TableHead({
  children,
  className = "",
  ...props
}: TableSectionProps<HTMLTableSectionElement>) {
  return (
    <thead className={className} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({
  children,
  className = "",
  ...props
}: TableSectionProps<HTMLTableSectionElement>) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
}

export function TableRow({
  children,
  className = "",
  ...props
}: TableSectionProps<HTMLTableRowElement>) {
  return (
    <tr className={className} {...props}>
      {children}
    </tr>
  );
}

export function TableHeader({
  children,
  className = "",
  ...props
}: TableSectionProps<HTMLTableCellElement>) {
  return (
    <th
      className={`text-left py-3 px-4 font-medium text-gray-500 ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className = "",
  ...props
}: TableSectionProps<HTMLTableCellElement>) {
  return (
    <td className={`py-3 px-4 text-gray-600 ${className}`} {...props}>
      {children}
    </td>
  );
}
