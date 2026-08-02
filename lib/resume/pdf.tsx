import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { ResumeModel } from "./model";

Font.registerHyphenationCallback((word) => [word]);

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingRight: 30,
    paddingBottom: 34,
    paddingLeft: 30,
    fontFamily: "Helvetica",
    fontSize: 9,
    lineHeight: 1.35,
    color: "#172033",
  },
  header: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#c8a45d",
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
    lineHeight: 1.1,
  },
  role: {
    marginTop: 3,
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    color: "#8a6828",
  },
  contactRow: {
    marginTop: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    fontSize: 8,
    color: "#4b5563",
  },
  contactLink: {
    color: "#4b5563",
    textDecoration: "none",
  },
  section: {
    marginTop: 11,
  },
  sectionTitle: {
    marginBottom: 6,
    paddingBottom: 2,
    borderBottomWidth: 0.6,
    borderBottomColor: "#d6d9df",
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summary: {
    color: "#374151",
  },
  entry: {
    marginBottom: 7,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  entryHeading: {
    flexGrow: 1,
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
  },
  period: {
    flexShrink: 0,
    fontSize: 8,
    color: "#6b7280",
  },
  bullet: {
    marginTop: 2,
    paddingLeft: 8,
    color: "#374151",
  },
  skillGroup: {
    marginBottom: 3,
  },
  skillCategory: {
    fontFamily: "Helvetica-Bold",
  },
  footer: {
    position: "absolute",
    right: 30,
    bottom: 16,
    fontSize: 7,
    color: "#9ca3af",
  },
});

function ResumePdfDocument({ model }: { model: ResumeModel }) {
  const { personalInfo } = model;
  const contacts = [personalInfo.location, personalInfo.phone].filter(Boolean);

  return (
    <Document
      title={`${personalInfo.name} — ${personalInfo.title}`}
      author={personalInfo.name}
      subject={model.summary}
      keywords="DevOps, SRE, Cloud, AWS, Kubernetes, Terraform"
      language={model.locale === "pt" ? "pt-BR" : "en"}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name}</Text>
          <Text style={styles.role}>{personalInfo.title}</Text>
          <View style={styles.contactRow}>
            {contacts.map((contact, index) => (
              <Text key={contact}>
                {index > 0 ? " • " : ""}
                {contact}
              </Text>
            ))}
            <Link
              src={`mailto:${personalInfo.email}`}
              style={styles.contactLink}
            >
              {contacts.length > 0 ? " • " : ""}
              {personalInfo.email}
            </Link>
            {personalInfo.linkedin && (
              <Link src={personalInfo.linkedin} style={styles.contactLink}>
                {" • LinkedIn"}
              </Link>
            )}
            {personalInfo.github && (
              <Link src={personalInfo.github} style={styles.contactLink}>
                {" • GitHub"}
              </Link>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={28}>
            {model.labels.about}
          </Text>
          <Text style={styles.summary}>{model.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={42}>
            {model.labels.experience}
          </Text>
          {model.experiences.map((experience) => (
            <View
              key={`${experience.company}-${experience.period}`}
              style={styles.entry}
              minPresenceAhead={36}
            >
              <View style={styles.entryHeader}>
                <Text style={styles.entryHeading}>
                  {experience.title} — {experience.company}
                </Text>
                <Text style={styles.period}>{experience.period}</Text>
              </View>
              {experience.responsibilities.map((responsibility) => (
                <Text
                  key={responsibility}
                  style={styles.bullet}
                >{`• ${responsibility}`}</Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle} minPresenceAhead={42}>
            {model.labels.skills}
          </Text>
          {model.skillGroups.map((group) => (
            <Text key={group.category} style={styles.skillGroup}>
              <Text style={styles.skillCategory}>{group.category}: </Text>
              {group.items.join(", ")}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle} minPresenceAhead={42}>
            {model.labels.education}
          </Text>
          {model.education.map((item) => (
            <View
              key={`${item.institution}-${item.period}`}
              style={styles.entry}
              minPresenceAhead={28}
            >
              <View style={styles.entryHeader}>
                <Text style={styles.entryHeading}>
                  {item.degree} — {item.institution}
                </Text>
                <Text style={styles.period}>{item.period}</Text>
              </View>
              {item.description && <Text>{item.description}</Text>}
            </View>
          ))}
        </View>

        <Text
          fixed
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}

export async function renderResumePdf(model: ResumeModel): Promise<Buffer> {
  return renderToBuffer(<ResumePdfDocument model={model} />);
}
