"use client";

import { Document } from "@/types/database";
import { Filter, ListIcon, SortAsc, SortDesc, TableIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getDocuments } from "../actions";
import { DocumentList } from "./DocumentList";
import { DocumentsTable } from "./DocumentsTable";

type DocumentWithOwner = Document & {
  owner_account?: {
    name: string | null;
    email_id: string;
  };
};

type SortField = "file_name" | "uploaded_at" | "file_size" | "owner";
type SortDirection = "asc" | "desc";

export const ChooseView = () => {
  const [documents, setDocuments] = useState<DocumentWithOwner[]>([]);
  const [view, setView] = useState<"table" | "list">("table");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedOwner, setSelectedOwner] = useState<string>("");
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

  // Extract unique tags, file types, and owners
  const { uniqueTags, uniqueTypes, uniqueOwners } = useMemo(() => {
    const tags = new Set<string>();
    const types = new Set<string>();
    const ownersMap = new Map<
      string,
      { id: string; name: string; hasAccountName: boolean }
    >();

    documents.forEach((doc: DocumentWithOwner) => {
      if (doc.category) {
        doc.category.split(",").forEach((tag: string) => {
          const trimmedTag = tag.trim();
          if (trimmedTag) tags.add(trimmedTag);
        });
      }
      if (doc.mime_type) {
        const type = doc.mime_type.split("/")[0];
        if (type) types.add(type);
      }
      if (doc.owner) {
        const ownerName = doc.owner_account?.name || doc.owner;
        const hasAccountName = !!doc.owner_account?.name;

        // Only add if we don't have this owner yet, or if this one has account name and previous doesn't
        if (!ownersMap.has(doc.owner)) {
          ownersMap.set(doc.owner, {
            id: doc.owner,
            name: ownerName,
            hasAccountName,
          });
        } else {
          const existing = ownersMap.get(doc.owner)!;
          if (hasAccountName && !existing.hasAccountName) {
            ownersMap.set(doc.owner, {
              id: doc.owner,
              name: ownerName,
              hasAccountName,
            });
          }
        }
      }
    });

    // Additional debugging to identify duplicates
    const ownerIdCounts = new Map<string, number>();
    documents.forEach((doc) => {
      if (doc.owner) {
        ownerIdCounts.set(doc.owner, (ownerIdCounts.get(doc.owner) || 0) + 1);
      }
    });

    const uniqueOwners = Array.from(ownersMap.values())
      .map(({ id, name }) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    console.log("Owner ID counts:", Array.from(ownerIdCounts.entries()));
    console.log("Owners map entries:", Array.from(ownersMap.entries()));
    console.log("Final unique owners:", uniqueOwners);
    console.log(
      "Are there duplicate IDs in final array?",
      uniqueOwners.map((o) => o.id).length !==
        new Set(uniqueOwners.map((o) => o.id)).size
    );

    return {
      uniqueTags: Array.from(tags).sort(),
      uniqueTypes: Array.from(types).sort(),
      uniqueOwners,
    };
  }, [documents]);

  // Filter and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    const filtered = documents.filter((doc: DocumentWithOwner) => {
      const matchesTag =
        !selectedTag || (doc.category && doc.category.includes(selectedTag));
      const matchesType =
        !selectedType ||
        (doc.mime_type && doc.mime_type.startsWith(selectedType));
      const matchesOwner = !selectedOwner || doc.owner === selectedOwner;
      return matchesTag && matchesType && matchesOwner;
    });

    // Sort documents
    filtered.sort((a: DocumentWithOwner, b: DocumentWithOwner) => {
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
        case "owner":
          aValue = (a.owner_account?.name || a.owner).toLowerCase();
          bValue = (b.owner_account?.name || b.owner).toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    documents,
    selectedTag,
    selectedType,
    selectedOwner,
    sortField,
    sortDirection,
  ]);

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
    setSelectedOwner("");
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
                { field: "owner" as SortField, label: "Owner" },
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tag Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Tag
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Types</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type?.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Owner Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Owner
              </label>
              <select
                value={selectedOwner}
                onChange={(e) => setSelectedOwner(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Owners</option>
                {uniqueOwners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name}
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
          <DocumentsTable
            documents={filteredAndSortedDocuments}
            onDocumentUpdate={getDocs}
          />
        )}
        {view === "list" && (
          <DocumentList
            documents={filteredAndSortedDocuments}
            onDocumentUpdate={getDocs}
          />
        )}
      </div>
    </div>
  );
};
