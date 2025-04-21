import { PreviewTemplateComponentProps } from "decap-cms-core";
import type { ProfileData } from "@/types/cms";

const ProfilePreview: React.FC<PreviewTemplateComponentProps> = ({ entry }) => {
  const data = entry.get("data").toJS() as ProfileData;
  const currentLocale = "pt"; // You can make this dynamic based on CMS locale

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">
          {data[currentLocale]?.name || data.pt?.name}
        </h1>
        <p className="text-xl text-gray-600">
          {data[currentLocale]?.title || data.pt?.title}
        </p>
        <p className="text-gray-500">
          {data[currentLocale]?.location || data.pt?.location}
        </p>
        <div className="prose max-w-none">
          {data[currentLocale]?.about || data.pt?.about}
        </div>
        <div className="pt-4">
          <p className="text-gray-600">{data.email}</p>
          {data.socialLinks && (
            <div className="flex gap-4 mt-2">
              {data.socialLinks.linkedin && (
                <a
                  href={data.socialLinks.linkedin}
                  className="text-blue-600 hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {data.socialLinks.github && (
                <a
                  href={data.socialLinks.github}
                  className="text-gray-900 hover:underline"
                >
                  GitHub
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;
