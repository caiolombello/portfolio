import { PreviewTemplateComponentProps } from "decap-cms-core";

const ProjectPreview: React.FC<PreviewTemplateComponentProps> = ({ entry }) => {
  const data = entry.get("data").toJS();
  const currentLocale = "pt"; // You can make this dynamic based on CMS locale

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <article className="space-y-6">
        <header className="space-y-4">
          <h1 className="text-3xl font-bold">
            {data[`title_${currentLocale}`] || data.title_pt}
          </h1>
          <p className="text-xl text-gray-600">
            {data[`shortDescription_${currentLocale}`] ||
              data.shortDescription_pt}
          </p>
          {data.imageUrl && (
            <img
              src={data.imageUrl}
              alt={data[`title_${currentLocale}`] || data.title_pt}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
        </header>

        <div className="flex flex-wrap gap-2">
          {data.technologies?.map((tech: { tech: string }, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              {tech.tech}
            </span>
          ))}
        </div>

        <div className="prose max-w-none">
          {data[`description_${currentLocale}`] || data.description_pt}
        </div>

        <footer className="pt-4 flex gap-4">
          {data.githubUrl && (
            <a
              href={data.githubUrl}
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
            >
              View on GitHub
            </a>
          )}
          {data.featured && (
            <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              Featured Project
            </span>
          )}
        </footer>

        <div className="text-sm text-gray-500">
          {data.createdAt && (
            <p>Created: {new Date(data.createdAt).toLocaleDateString()}</p>
          )}
          {data.updatedAt && (
            <p>Last updated: {new Date(data.updatedAt).toLocaleDateString()}</p>
          )}
        </div>
      </article>
    </div>
  );
};

export default ProjectPreview;
