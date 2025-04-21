import { PreviewTemplateComponentProps } from "decap-cms-core";
import type { Education } from "@/types/cms";

const EducationPreview: React.FC<PreviewTemplateComponentProps> = ({
  entry,
}) => {
  const data = entry.get("data").toJS() as Education;
  const currentLocale = "pt"; // You can make this dynamic based on CMS locale

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <article className="space-y-4 border rounded-lg p-6 bg-white shadow-sm">
        <header>
          <h3 className="text-xl font-bold">{data.institution}</h3>
          <p className="text-lg text-gray-700">
            {data[`degree_${currentLocale}`] || data.degree_pt}
          </p>
          <p className="text-sm text-gray-500">{data.period}</p>
        </header>

        <div className="prose max-w-none text-gray-700">
          {data[`description_${currentLocale}`] || data.description_pt}
        </div>

        {data.endDate && (
          <footer className="text-sm text-gray-500 pt-2">
            Expected completion:{" "}
            {new Date(data.endDate + "-01").toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
            })}
          </footer>
        )}
      </article>
    </div>
  );
};

export default EducationPreview;
