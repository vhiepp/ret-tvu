import { axiosInstance } from "./AxiosCofig";

const getActivate = () => {
  return axiosInstance.get(`/activate.json`);
};

const getSpeakers = () => {
  return axiosInstance.get(`/speakers.json`);
};

const getSponsors = () => {
  return axiosInstance.get(`/sponsors.json`);
};

const getTravelInfo = () => {
  return axiosInstance.get(`/travel_info.json`);
};

const getSubmissionGuideline = () => {
  return axiosInstance.get(`/submission_guideline.json`);
};

const getCommittees = () => {
  return axiosInstance.get(`/committees.json`);
};

const getTopics = () => {
  return axiosInstance.get(`/topics.json`);
};

const getImportantDate = () => {
  return axiosInstance.get(`/important_date.json`);
};

const getAboutRet = () => {
  return axiosInstance.get(`/about_ret.json`);
};

const getContact = () => {
  return axiosInstance.get(`/contact.json`);
};

const getKey = () => {
  return axiosInstance.get(`/key.json`);
};

const getRegistration = () => {
  return axiosInstance.get(`/registration.json`);
};

const getConferenceProgram = () => {
  return axiosInstance.get(`/conference-program.json`);
};

const getParallelSession1 = () => {
  return axiosInstance.get(`/program-parallel-sessions-1.json`);
};

const getParallelSession2 = () => {
  return axiosInstance.get(`/program-parallel-sessions-2.json`);
};

const clearCache = () => {
  // return axiosInstance.delete(`/clear`);
  return null;
};

export {
  getRegistration,
  getSpeakers,
  getTravelInfo,
  getSubmissionGuideline,
  getCommittees,
  getTopics,
  getImportantDate,
  getAboutRet,
  getKey,
  clearCache,
  getContact,
  getConferenceProgram,
  getParallelSession1,
  getParallelSession2,
  getSponsors,
  getActivate,
};
