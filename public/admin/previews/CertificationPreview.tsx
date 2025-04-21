import { PreviewTemplateComponentProps } from "decap-cms-core";
import type { Certification } from "@/types/cms";

const CertificationPreview: React.FC<PreviewTemplateComponentProps> = ({
  entry,
}) => {
  const data = entry.get("data").toJS() as Certification;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <article className="space-y-4 border rounded-lg p-6 bg-white shadow-sm">
        <header>
          <h3 className="text-xl font-bold">{data.name}</h3>
          <p className="text-lg text-gray-700">{data.issuer}</p>
          <p className="text-sm text-gray-500">
            {new Date(data.date).toLocaleDateString()}
          </p>
        </header>

        {data.description && (
          <div className="prose max-w-none text-gray-700">
            {data.description}
          </div>
        )}

        {data.url && (
          <footer className="pt-2">
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              View Certificate →
            </a>
          </footer>
        )}
      </article>
    </div>
  );
};

export default CertificationPreview;
