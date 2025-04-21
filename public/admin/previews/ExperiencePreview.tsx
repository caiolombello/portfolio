import { PreviewTemplateComponentProps } from "decap-cms-core";
import type { Experience } from "@/types/cms";

const ExperiencePreview: React.FC<PreviewTemplateComponentProps> = ({
  entry,
}) => {
  const data = entry.get("data").toJS() as Experience;
  const currentLocale = "pt"; // You can make this dynamic based on CMS locale

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <article className="space-y-4 border rounded-lg p-6 bg-white shadow-sm">
        <header>
          <h3 className="text-xl font-bold">{data.company}</h3>
          <p className="text-lg text-gray-700">
            {data[`title_${currentLocale}`] || data.title_pt}
          </p>
          <p className="text-sm text-gray-500">{data.period}</p>
        </header>

        <ul className="list-disc pl-5 space-y-2">
          {(
            data[`responsibilities_${currentLocale}`] ||
            data.responsibilities_pt
          )?.map((resp: { item: string }, index: number) => (
            <li key={index} className="text-gray-700">
              {resp.item}
            </li>
          ))}
        </ul>

        {data.startDate && (
          <footer className="text-sm text-gray-500 pt-2">
            Start Date: {new Date(data.startDate).toLocaleDateString()}
          </footer>
        )}
      </article>
    </div>
  );
};

export default ExperiencePreview;
