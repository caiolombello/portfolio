import CMS from "decap-cms-app";
import ProfilePreview from "./ProfilePreview";
import ProjectPreview from "./ProjectPreview";
import PostPreview from "./PostPreview";
import ExperiencePreview from "./ExperiencePreview";
import EducationPreview from "./EducationPreview";
import CertificationPreview from "./CertificationPreview";
import { TechnologyPicker } from "@/components/cms/widgets/technology-picker";
import { ImageInput } from "@/components/cms/widgets/image-input";

// Register preview templates
CMS.registerPreviewTemplate("profile", ProfilePreview);
CMS.registerPreviewTemplate("projects", ProjectPreview);
CMS.registerPreviewTemplate("posts", PostPreview);
CMS.registerPreviewTemplate("experience", ExperiencePreview);
CMS.registerPreviewTemplate("education", EducationPreview);
CMS.registerPreviewTemplate("certifications", CertificationPreview);

// Register custom widgets
CMS.registerWidget("technology-picker", TechnologyPicker);
CMS.registerWidget("image-input", ImageInput);

// Initialize the CMS
CMS.init();
