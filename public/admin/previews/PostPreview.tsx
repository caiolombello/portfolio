import { PreviewTemplateComponentProps } from "decap-cms-core";
import ReactMarkdown from "react-markdown";

const PostPreview: React.FC<PreviewTemplateComponentProps> = ({ entry }) => {
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
            {data[`summary_${currentLocale}`] || data.summary_pt}
          </p>
          {data.imageUrl && (
            <img
              src={data.imageUrl}
              alt={data[`title_${currentLocale}`] || data.title_pt}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {data.author?.name && (
              <div className="flex items-center gap-2">
                {data.author.avatar && (
                  <img
                    src={data.author.avatar}
                    alt={data.author.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span>{data.author.name}</span>
              </div>
            )}
            {data.publicationDate && (
              <time dateTime={data.publicationDate}>
                {new Date(data.publicationDate).toLocaleDateString()}
              </time>
            )}
            {data.category && (
              <span className="px-3 py-1 bg-gray-100 rounded-full">
                {data.category}
              </span>
            )}
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          {data.tags?.map((tag: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="prose max-w-none">
          <ReactMarkdown>
            {data[`body_${currentLocale}`] || data.body_pt || ""}
          </ReactMarkdown>
        </div>

        {!data.published && (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
            Draft - This post is not published yet
          </div>
        )}
      </article>
    </div>
  );
};

export default PostPreview;
