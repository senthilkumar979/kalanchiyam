"use client";

import { FileTypeIcon } from "@/components/icons/FileTypeIcon";
import { formatDate, formatFileType } from "@/lib/utils";
import { Document } from "@/types/database";
import React from "react";
import { Column, useTable } from "react-table";
import { DownloadActions } from "./DownloadActions";

interface DocumentsTableProps {
  documents: Document[];
  onDocumentUpdate?: () => void;
}

type TableData = {
  id: string;
  file_name: string;
  category: string | null;
  mimeType: string | null;
  uploadedAt: string;
  owner: string;
  owner_account?: {
    name: string | null;
    email_id: string;
  };
};

export const DocumentsTable: React.FC<DocumentsTableProps> = ({
  documents,
  onDocumentUpdate,
}) => {
  const data = React.useMemo<TableData[]>(
    () =>
      documents.map(
        (
          doc: Document & {
            owner_account?: { name: string | null; email_id: string };
          }
        ) => ({
          id: doc.id,
          file_name: doc.file_name,
          category: doc.category,
          mimeType: doc.mime_type,
          uploadedAt: formatDate(doc.uploaded_at),
          owner: doc.owner,
          owner_account: doc.owner_account,
        })
      ),
    [documents]
  );

  const columns = React.useMemo<Column<TableData>[]>(
    () => [
      {
        Header: "Icon",
        Cell: ({ row }) => (
          <FileTypeIcon fileName={row.original.file_name} className="w-5 h-5" />
        ),
      },
      {
        Header: "Name",
        accessor: "file_name",
        Cell: ({ row }) => (
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-gray-900 truncate flex items-center justify-between gap-2">
              {row.original.file_name}
              <DownloadActions
                doc={row.original as unknown as Document}
                onDocumentUpdate={onDocumentUpdate}
              />
            </span>
          </div>
        ),
      },
      {
        Header: "Tags",
        accessor: "category",
        Cell: ({ value }) => (
          <div className="flex flex-wrap gap-1">
            {value ? (
              value.split(",").map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                >
                  {tag.trim()}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400 italic">No tags</span>
            )}
          </div>
        ),
      },
      {
        Header: "Owner",
        accessor: "owner",
        Cell: ({ row }) => (
          <span className="text-sm text-gray-900">
            {row.original.owner_account?.name || row.original.owner}
          </span>
        ),
      },
      {
        Header: "MIME Type",
        accessor: "mimeType",
        Cell: ({ value }) => (
          <span className="text-xs text-gray-600 flex">
            {formatFileType(value ?? "") || "Unknown"}
          </span>
        ),
      },
      {
        Header: "Uploaded At",
        accessor: "uploadedAt",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <div className="overflow-x-auto">
      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-gray-200"
      >
        <thead className="bg-gray-50">
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key
                <th
                  {...column.getHeaderProps()}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className="bg-white divide-y divide-gray-200"
        >
          {rows.map((row) => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key
              <tr {...row.getRowProps()} className="group">
                {row.cells.map((cell) => (
                  // eslint-disable-next-line react/jsx-key
                  <td
                    {...cell.getCellProps()}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
