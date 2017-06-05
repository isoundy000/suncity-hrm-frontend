/**
 * Created by meng on 16/9/16.
 */

import { NAVIGATION_KEY, SEARCH_MENU_KEY } from '../../constants/MenuConstants';

export const navigationMenu = (classes) => {
  return [
    {
      key: NAVIGATION_KEY.PROFILES,
      chinese_name: '檔案',
      english_name: 'profiles',
      className: classes.naviProfiles,
      submenu: [
        {
          key: 'profiles',
          url: '/profiles',
          chinese_name: '員工檔案',
          english_name: 'Employee Profiles'
        },
        {
          key: 'architecture',
          url: '/architecture',
          chinese_name: '公司組織架構',
          english_name: 'Architecture',
        },
      ],
    },
    {
      key: NAVIGATION_KEY.RECRUIT,
      chinese_name: '招聘',
      english_name: 'Recruit',
      className: classes.naviRecruit,
      submenu: [
        {
          key: 'applicant_profiles',
          url: '/applicant_profiles',
          chinese_name: '求職者檔案',
          english_name: 'Applicant Profiles'
        },
        {
          key: 'jobs',
          url: '/jobs',
          chinese_name: '職位管理',
          english_name: 'Jobs'
        },

        // For 1AND2
        /* {
           key: 'my_recruit',
           url: '/recruit/myrecruit',
           chinese_name: '我的招聘',
           english_name: 'My Recruit'
           },
         */
        {
          key: 'entry_file',
          url: '/entryFile',
          chinese_name: '缺失入職文件',
          english_name: 'EntryFile'
        },
      ],
    },

    // For 1AND2

    /* {
       key: NAVIGATION_KEY.ATTENDANCE,
       chinese_name: '考勤',
       english_name: 'Attendance',
       className: classes.naviAttendance,
       submenu: [],
       },

       {
       key: NAVIGATION_KEY.PAYMENT,
       chinese_name: '薪酬',
       english_name: 'Payment',
       className: classes.naviPayment,
       submenu: [],
       },
     */
    /*
       {
       key: 'file',
       title: '文件',
       className: classes.naviFile,
       submenu: [],
       },
     */

    /* {
       key: NAVIGATION_KEY.PERFORMANCE,
       chinese_name: '绩效',
       english_name: 'Performance',
       className: classes.naviPerformance,
       submenu: [],
       },
     */

    /* {
       key: NAVIGATION_KEY.TRAINING,
       chinese_name: '培训',
       english_name: 'Training',
       className: classes.naviTraining,
       submenu: [],
       },
     */

    /* { */
    /* key: NAVIGATION_KEY.CHART, */
    /* chinese_name: '报表', */
    /* english_name: 'Chart', */
    /* className: classes.naviChart, */
    /* submenu: [], */
    /* }, */
  ];
}
