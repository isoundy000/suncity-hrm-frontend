/**
 * Created by meng on 16/9/16.
 */

export const SEARCH_TYPE = {
  EMPLOYEE_NO: 'empoid',
  CHINESE_NAME: 'chinese_name',
  ENGLISH_NAME: 'english_name',
  ID_CARD_NUMBER: 'id_card_number',
  APPLICANT_NO: 'applicant_applicant_no',
  APPLICANT_CHINESE_NAME: 'applicant_chinese_name',
  APPLICANT_ENGLISH_NAME: 'applicant_english_name',
  APPLICANT_ID_CARD_NUMBER: 'applicant_id_card_number'
};

export const SEARCH_CATEGORIES = [
  {
    search_type: SEARCH_TYPE.EMPLOYEE_NO,
    chinese_name: '員工編號',
    english_name: 'Employee No.',
    search_source:'profiles',
  },
  {
    search_type: SEARCH_TYPE.CHINESE_NAME,
    chinese_name: '員工中文姓名',
    english_name: 'Chinese Name',
    search_source:'profiles',
  },
  {
    search_type: SEARCH_TYPE.ENGLISH_NAME,
    chinese_name: '員工外文姓名',
    english_name: 'English Name',
    search_source:'profiles',
  },
  {
    search_type: SEARCH_TYPE.ID_CARD_NUMBER,
    chinese_name: '員工證件號碼',
    english_name: 'ID Card No.',
    search_source:'profiles',
  },
  {
    search_type: SEARCH_TYPE.APPLICANT_NO,
    chinese_name: '求職編號',
    english_name: 'Applicant No.',
    search_source:'applicantProfiles',
  },
  {
    search_type: SEARCH_TYPE.APPLICANT_CHINESE_NAME,
    chinese_name: '求職者中文姓名',
    english_name: 'Applicant Chinese Name',
    search_source:'applicantProfiles',
  },
  {
    search_type: SEARCH_TYPE.APPLICANT_ENGLISH_NAME,
    chinese_name: '求職者外文姓名',
    english_name: 'Applicant English Name',
    search_source:'applicantProfiles',
  },
  {
    search_type: SEARCH_TYPE.APPLICANT_ID_CARD_NUMBER,
    chinese_name: '求職者證件編號',
    english_name: 'Applicant ID Card No.',
    search_source:'applicantProfiles',
  },
];
