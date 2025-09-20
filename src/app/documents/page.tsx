import { getDocuments } from "./actions";
import { DocumentUpload } from "./components/DocumentUpload";
import { DocumentList } from "./components/DocumentList";

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">
              Document Management
            </h1>
            <p className="mt-2 text-secondary-600">
              Upload, organize, and manage your personal documents securely.
            </p>
          </div>
          <DocumentUpload />
        </div>
      </div>

      <DocumentList documents={documents} />
    </div>
  );
}
