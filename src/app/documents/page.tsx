import { ChooseView } from "./components/ChooseView";
import { DocumentUpload } from "./components/DocumentUpload";
import { PredefinedDocs } from "./components/PredefinedDocs";

export default async function DocumentsPage() {
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
          <div className="flex items-center gap-4">
            <PredefinedDocs />
            <DocumentUpload />
          </div>
        </div>
      </div>

      <ChooseView />
    </div>
  );
}
