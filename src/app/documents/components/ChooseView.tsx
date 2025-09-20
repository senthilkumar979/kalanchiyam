"use client";

import { Document } from "@/types/database";
import { Filter, ListIcon, SortAsc, SortDesc, TableIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getDocuments } from "../actions";
import { DocumentList } from "./DocumentList";
import { DocumentsTable } from "./DocumentsTable";

type SortField = "file_name" | "uploaded_at" | "file_size";
type SortDirection = "asc" | "desc";

export const ChooseView = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [view, setView] = useState<"table" | "list">("table");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("uploaded_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [showFilters, setShowFilters] = useState(false);

  const getDocs = async () => {
    const documents = await getDocuments();
    setDocuments(documents);
  };

  useEffect(() => {
    getDocs();
  }, []);

  // Extract unique tags and file types
  const { uniqueTags, uniqueTypes } = useMemo(() => {
    const tags = new Set<string>();
    const types = new Set<string>();

    documents.forEach((doc) => {
      if (doc.category) {
        doc.category.split(",").forEach((tag) => {
          const trimmedTag = tag.trim();
          if (trimmedTag) tags.add(trimmedTag);
        });
      }
      if (doc.mime_type) {
        const type = doc.mime_type.split("/")[0];
        if (type) types.add(type);
      }
    });

    return {
      uniqueTags: Array.from(tags).sort(),
      uniqueTypes: Array.from(types).sort(),
    };
  }, [documents]);

  // Filter and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    const filtered = documents.filter((doc) => {
      const matchesTag =
        !selectedTag || (doc.category && doc.category.includes(selectedTag));
      const matchesType =
        !selectedType ||
        (doc.mime_type && doc.mime_type.startsWith(selectedType));
      return matchesTag && matchesType;
    });

    // Sort documents
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "file_name":
          aValue = a.file_name.toLowerCase();
          bValue = b.file_name.toLowerCase();
          break;
        case "uploaded_at":
          aValue = new Date(a.uploaded_at).getTime();
          bValue = new Date(b.uploaded_at).getTime();
          break;
        case "file_size":
          aValue = a.file_size || 0;
          bValue = b.file_size || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [documents, selectedTag, selectedType, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setSelectedTag("");
    setSelectedType("");
  };

  return (
    <div>
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
        {/* Filter and Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <div className="flex gap-1">
              {[
                { field: "file_name" as SortField, label: "Name" },
                { field: "uploaded_at" as SortField, label: "Date" },
                { field: "file_size" as SortField, label: "Size" },
              ].map(({ field, label }) => (
                <button
                  key={field}
                  onClick={() => handleSort(field)}
                  className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${
                    sortField === field
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {label}
                  {sortField === field &&
                    (sortDirection === "asc" ? (
                      <SortAsc className="w-3 h-3" />
                    ) : (
                      <SortDesc className="w-3 h-3" />
                    ))}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex space-x-2">
          <button
            aria-label="Switch to table view"
            className={`p-2 rounded ${
              view === "table"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setView("table")}
          >
            <TableIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView("list")}
            aria-label="Switch to list view"
            className={`p-2 rounded ${
              view === "list"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-200"
            }`}
          >
            <ListIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Tag Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Tag
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Tags</option>
                {uniqueTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredAndSortedDocuments.length} of {documents.length}{" "}
        documents
      </div>

      {/* Document Views */}
      <div>
        {view === "table" && (
          <DocumentsTable documents={filteredAndSortedDocuments} />
        )}
        {view === "list" && (
          <DocumentList documents={filteredAndSortedDocuments} />
        )}
      </div>
    </div>
  );
};
