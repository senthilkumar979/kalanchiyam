import { getDocuments } from "./actions";
import { DocumentUpload } from "./components/DocumentUpload";
import { DocumentList } from "./components/DocumentList";
import { PageContainer } from "@/components/layout/PageContainer";
import { Navigation } from "@/components/layout/Navigation";
import { ContentContainer } from "@/components/layout/ContentContainer";

export default async function DocumentsPage() {
  const documents = await getDocuments();

  return (
    <PageContainer>
      <Navigation
        title="Kalanchiyam"
        showBackButton
        backHref="/dashboard"
        backText="Dashboard"
      >
        <div className="flex items-center space-x-4">
          <a
            href="/dashboard"
            className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Dashboard
          </a>
          <a
            href="/documents"
            className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium"
          >
            Documents
          </a>
        </div>
      </Navigation>

      <ContentContainer maxWidth="4xl" className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Document Management
          </h1>
          <p className="mt-2 text-gray-600">
            Upload, organize, and manage your personal documents securely.
          </p>
        </div>

        <div className="space-y-8">
          <DocumentUpload />
          <DocumentList documents={documents} />
        </div>
      </ContentContainer>
    </PageContainer>
  );
}
