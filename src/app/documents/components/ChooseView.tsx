"use client";

import { Document } from "@/types/database";
import { ListIcon, TableIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getDocuments } from "../actions";
import { DocumentList } from "./DocumentList";
import { DocumentsTable } from "./DocumentsTable";

export const ChooseView = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const getDocs = async () => {
    const documents = await getDocuments();
    setDocuments(documents);
  };
  useEffect(() => {
    getDocs();
  }, []);
  const [view, setView] = useState<"table" | "list">("table");

  return (
    <div>
      <div className="flex flex-row justify-end space-x-2 mb-4">
        <button
          aria-label="Switch to table view"
          className="p-2 rounded hover:bg-gray-200"
          onClick={() => setView("table")}
        >
          <TableIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => setView("list")}
          aria-label="Switch to list view"
          className="p-2 rounded hover:bg-gray-200"
        >
          <ListIcon className="w-5 h-5" />
        </button>
      </div>

      <div>{view === "table" && <DocumentsTable documents={documents} />}</div>
      <div>{view === "list" && <DocumentList documents={documents} />}</div>
    </div>
  );
};
