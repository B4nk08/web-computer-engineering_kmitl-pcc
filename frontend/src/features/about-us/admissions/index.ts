export { AdmissionsView } from "./components/admissions-view";
export { fetchAdmissions, fetchAdmissionsList } from "./api";
export { useAdmissions, useAdmissionsList } from "./hooks/use-admissions";
export type {
  AdmissionsInfo,
  AdmissionBlock,
  AdmissionSectionContent,
  SupportItem,
} from "./types";
export {
  parseAdmissionBlocks,
  blocksFromSection,
  emptyAdmissionSection,
  sectionFromExtraValue,
  sectionToExtraValue,
} from "./types";
