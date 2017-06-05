const messages = [
  {
    id: 'app.global.pagination.prev',
    defaultMessage: '前一頁',
    en: 'Previous Page',
  },
  {
    id: 'app.global.pagination.next',
    defaultMessage: '後一頁',
    en: 'Next Page',
  },
  {
    id: 'app.global.macau',
    defaultMessage: '澳門',
    en: 'Macau',
  },
  {
    id: 'app.global.manila',
    defaultMessage: '馬尼拉',
    en: 'Manila',
  },
  {
    id: 'app.global.tw',
    defaultMessage: '繁中',
    en: 'zh-TW',
  },
  {
    id: 'app.global.cn',
    defaultMessage: '簡中',
    en: 'zh-CN',
  },
  {
    id: 'app.global.en',
    defaultMessage: '英文',
    en: 'en-US',
  },
  {
    id: 'app.global.switchto',
    defaultMessage: '切換至 ',
    en: 'Switch to ',
  },
  {
    id: 'app.global.account',
    defaultMessage: '帳號 ',
    en: 'account',
  },
  {
    id: 'app.global.logout',
    defaultMessage: '登出',
    en: 'Logout',
  },
  {
    id: 'app.global.cancel',
    defaultMessage: '取消',
    en: 'Cancel',
  },
  {
    id: 'app.global.ok',
    defaultMessage: '確認',
    en: 'OK',
  },
  {
    id: 'app.global.logout',
    defaultMessage: '登出',
    en: 'Logout',
  },
  {
    id: 'app.global.search_placeholder',
    defaultMessage: '請輸入搜索內容',
    en: 'Please input search keyword',
  },
  {
    id: 'app.search.advanced_search',
    defaultMessage: '高級搜索',
    en: 'Advanced Search',
  },
  {
    id: 'app.search.category',
    defaultMessage: '搜索類別',
    en: 'Category',
  },
  {
    id: 'app.search.content',
    defaultMessage: '搜索內容',
    en: 'Content',
  },
  {
    id: 'app.search.unmatch_message',
    defaultMessage: '以下信息填寫錯誤,未能查找到匹配信息,請修正。',
    en: 'Items error below, can not find matched information, correct them please.',
  },
  {
    id: 'app.search.ignore',
    defaultMessage: '忽略',
    en: 'Ignore',
  },
  {
    id: 'app.search.retry',
    defaultMessage: '重試',
    en: 'Retry',
  },
  {
    id: 'app.user.empno',
    defaultMessage: '員工編號',
    en: 'Employee Number',
  },
  {
    id: 'app.user.id_card_number',
    defaultMessage: '證件號碼',
    en: 'ID Card Number',
  },
  {
    id: 'app.user.password',
    defaultMessage: '密碼',
    en: 'Password',
  },
  {
    id: 'app.helper.pleaseinput',
    defaultMessage: '請輸入',
    en: 'Please Input',
  },
  {
    id: 'app.helper.login',
    defaultMessage: '登 錄',
    en: 'Login',
  },
  {
    id: 'app.api.login_error',
    defaultMessage: '登錄失敗，用戶名或密碼錯誤',
    en: 'Invalid username or password',
  },
  {
    id: 'app.nav.recruit',
    defaultMessage: '招聘',
    en: 'Recruit',
  },
  {
    id: 'app.nav.document',
    defaultMessage: '檔案',
    en: 'Document',
  },
  {
    id: 'app.nav.switch_lang',
    defaultMessage: 'Switch To English',
    en: '切換語言',
  },
  {
    id: 'app.nav.document.profiles',
    defaultMessage: '員工檔案',
    en: 'Archives',
  },
  {
    id: 'app.nav.document.subordinate_profiles',
    defaultMessage: '下屬檔案',
    en: 'Subordinate Profiles',
  },
  {
    id: 'app.nav.attendance',
    defaultMessage: '考勤',
    en: 'Attendance',
  },
  {
    id: 'app.nav.salary',
    defaultMessage: '薪酬',
    en: 'Salary',
  },
  {
    id: 'app.nav.files',
    defaultMessage: '文件',
    en: 'Files',
  },
  {
    id: 'app.nav.performance',
    defaultMessage: '績效',
    en: 'Performace',
  },
  {
    id: 'app.nav.train',
    defaultMessage: '培訓',
    en: 'Train',
  },
  {
    id: 'app.nav.report',
    defaultMessage: '報表',
    en: 'Report',
  },
  {
    id: 'app.block.personal_file_list',
    defaultMessage: '員工檔案',
    en: 'Archives',
  },
  {
    id: 'app.block.add_action_title',
    defaultMessage: '新增',
    en: 'Add',
  },
  {
    id: 'app.block.export_action_title',
    defaultMessage: '匯出',
    en: 'Export',
  },
  {
    id: 'app.upload.uploadfile',
    defaultMessage: '上傳文件',
    en: 'Upload File',
  },
  {
    id: 'app.upload.uploadtext',
    defaultMessage: '點擊或將文件拖拽到這裏上傳',
    en: 'Click or Drag file here to upload',
  },
  {
    id: 'app.upload.uploadhint',
    defaultMessage: '支持擴展名: .doc .docx .pdf .jpg .png ...',
    en: 'File type supported: .doc .docx .pdf .jpg .png ...',
  },
  {
    id: 'app.upload.category',
    defaultMessage: '類別',
    en: 'Category',
  },
  {
    id: 'app.upload.comment',
    defaultMessage: '備註',
    en: 'Comment',
  },
  {
    id: 'app.upload.comment_placeholder',
    defaultMessage: '請輸入備註信息',
    en: 'Input comment here',
  },
  {
    id: 'app.selectinput.empty',
    defaultMessage: '搜索結果為空',
    en: 'No Result',
  },
  {
    id: 'app.button.filter',
    defaultMessage: '篩選',
    en: 'Filter',
  },
  {
    id: 'app.fields.chinese_name',
    defaultMessage: '中文姓名',
    en: 'Chinese Name',
  },
  {
    id: 'app.fields.english_name',
    defaultMessage: '外文姓名',
    en: 'English Name',
  },

  {
    id: 'app.fields.nick_name',
    defaultMessage: '昵稱',
    en: 'Nickname',
  },
  {
    id: 'app.fields.photo',
    defaultMessage: '照片',
    en: 'Photo',
  },
  {
    id: 'app.fields.gender',
    defaultMessage: '性別',
    en: 'Gender',
  },
  {
    id: 'app.fields.national',
    defaultMessage: '國籍',
    en: 'National',
  },
  {
    id: 'app.files.category',
    defaultMessage: '類別',
    en: 'Category',
  },
  {
    id: 'app.files.filename',
    defaultMessage: '文件名',
    en: 'File Name',
  },
  {
    id: 'app.files.comment',
    defaultMessage: '備註',
    en: 'Comment',
  },
  {
    id: 'app.files.upload_date',
    defaultMessage: '上傳日期',
    en: 'Upload Date',
  },
  {
    id: 'app.files.uploader',
    defaultMessage: '經手人',
    en: 'Uploader',
  },
  {
    id: 'app.files.operation',
    defaultMessage: '操作',
    en: 'Operation',
  },
  {
    id: 'app.files.upload_file',
    defaultMessage: '上傳文件',
    en: 'Upload File',
  },
  {
    id: 'app.files.manage_categories',
    defaultMessage: '管理類別',
    en: 'Manage Categories',
  },
  {
    id: 'app.nav.document.architecture_setting',
    defaultMessage: '公司架構設置',
    en: 'Architecture Setting',
  },
  {
    id: 'app.home.document.my_profiles',
    defaultMessage: '我的檔案',
    en: 'My Profiles',
  },
  {
    id: 'app.home.document.subordinate_profiles',
    defaultMessage: '部門員工檔案',
    en: 'Subordinate Profiles',
  },
  {
    id: 'app.home.document.my_recruit',
    defaultMessage: '我的招聘',
    en: 'My Recruit',
  },
  {
    id: 'app.home.attendance.my_attendance_record',
    defaultMessage: '我的打卡記錄',
    en: 'My Attendance Record',
  },
  {
    id: 'app.home.attendance.subordinate_attendance_record',
    defaultMessage: '下屬打卡記錄',
    en: 'Subordinate Attendance Record',
  },
  {
    id: 'app.home.attendance.my_attendance',
    defaultMessage: '我的考勤',
    en: 'My attendance',
  },
  {
    id: 'app.home.attendance.approval_of_attendance',
    defaultMessage: '考勤表審批',
    en: 'Approval Of Attendance',
  },
  {
    id: 'app.home.attendance.my_vacation',
    defaultMessage: '我的假期',
    en: 'My Vacation',
  },
  {
    id: 'app.home.attendance.apply_for_vacation',
    defaultMessage: '申請休假',
    en: 'Apply For Vacation',
  },
  {
    id: 'app.home.attendance.approval_of_vacation',
    defaultMessage: '假期審批',
    en: 'Approval Of Vacation',
  },
  {
    id: 'app.home.attendance.record_of_apply_for_vacation',
    defaultMessage: '休假申請記錄',
    en: 'Record Of Apply For Vacation',
  },
  {
    id: 'app.home.attendance.my_timetable',
    defaultMessage: '我的排更',
    en: 'My Timetable',
  },
  {
    id: 'app.home.attendance.apply_for_transform',
    defaultMessage: '申請調更調假',
    en: 'Apply For Transform',
  },
  {
    id: 'app.home.attendance.approval_of_transform',
    defaultMessage: '調更調假審批',
    en: 'Approval Of Transform',
  },
  {
    id: 'app.home.attendance.record_of_transform',
    defaultMessage: '調更調假記錄',
    en: 'Record Of Transform',
  },
  {
    id: 'app.home.salary.apply_for_full',
    defaultMessage: '轉正申請',
    en: 'Apply For Full',
  },
  {
    id: 'app.home.salary.approval_for_full',
    defaultMessage: '轉正審批',
    en: 'Approval For Full',
  },
  {
    id: 'app.home.salary.record_of_apply_for_full',
    defaultMessage: '轉正申請記錄',
    en: 'Record Of Apply For Full',
  },
  {
    id: 'app.home.salary.assesment_of_applying',
    defaultMessage: '評覈申請',
    en: 'Assesment Of Applying',
  },
  {
    id: 'app.home.salary.assesment_of_approval',
    defaultMessage: '評覈審批',
    en: 'Assesment Of Approval',
  },
  {
    id: 'app.home.salary.apply_for_360',
    defaultMessage: '申請360評覈',
    en: 'Apply For 360',
  },
  {
    id: 'app.home.salary.assesment_of_360',
    defaultMessage: '360評覈',
    en: 'Assesment Of 360',
  },
  {
    id: 'app.home.performance.my_salary',
    defaultMessage: '我的薪酬',
    en: 'My Salary',
  },
  {
    id: 'app.home.performance.my_payroll',
    defaultMessage: '我的工資單',
    en: 'My Payroll',
  },
  {
    id: 'app.home.performance.apply_for_health_insurance',
    defaultMessage: '申請醫療保險',
    en: 'Apply For Health Insurance',
  },
  {
    id: 'app.home.performance.record_of_health_insurance',
    defaultMessage: '醫療保險記錄',
    en: 'Record Of Health Insurance',
  },
  {
    id: 'app.home.train.my_train',
    defaultMessage: '我的培訓',
    en: 'My Train',
  },

  {
    id: 'app.arch.top_button',
    defaultMessage: '架構圖',
    en: 'Architecture Map',
  },

  {
    id: 'app.arch.tabpanel.tabpanel_title',
    defaultMessage: '公司組織架構',
    en: 'Company Architecture',
  },

  {
    id: 'app.arch.tabpanel.for_departments',
    defaultMessage: '按部門',
    en: 'For Departments',
  },

  {
    id: 'app.arch.tabpanel.for_positions',
    defaultMessage: '按職位',
    en: 'For Positions',
  },

  {
    id: 'app.arch.tabpanel.for_locations',
    defaultMessage: '按場館',
    en: 'For Locations ',
  },

  {
    id: 'app.arch.datatable.department_level',
    defaultMessage: '部門層級',
    en: 'Department Level',
  },

  {
    id: 'app.arch.datatable.header',
    defaultMessage: '負責人',
    en: 'Header',
  },

  {
    id: 'app.arch.datatable.employees_count',
    defaultMessage: '在職人數',
    en: 'Employees Count',
  },

  {
    id: 'app.arch.datatable.position_level',
    defaultMessage: '職位層級',
    en: 'Position Level',
  },

  {
    id: 'app.arch.datatable.department',
    defaultMessage: '部門',
    en: 'Department',
  },

  {
    id: 'app.arch.datatable.location_name',
    defaultMessage: '場館名稱',
    en: 'Location Name',
  },

  {
    id: 'app.arch.operation.ctrl_button',
    defaultMessage: '操作',
    en: 'Control',
  },

  {
    id: 'app.arch.operation.edit_title',
    defaultMessage: '編輯',
    en: 'Edit',
  },

  {
    id: 'app.arch.operation.delete_title',
    defaultMessage: '刪除',
    en: 'Delete',
  },
  {
    id: 'app.arch.operation.new_subdepartment_title',
    defaultMessage: '新增下級部門',
    en: 'New Subdepartment',
  },
  {
    id: 'app.arch.operation.new_subposition_title',
    defaultMessage: '新增下級職位',
    en: 'New Subposition',
  },

  {
    id: 'app.arch.operation.enable_status',
    defaultMessage: '啓用',
    en: 'Enable',
  },
  {
    id: 'app.arch.operation.disable_status',
    defaultMessage: '停用',
    en: 'Disable',
  },

  {
    id: 'app.arch.operation.edit',
    defaultMessage: '修改',
    en: 'Edit',
  },

  {
    id: 'app.arch.operation.be_ok',
    defaultMessage: '確定',
    en: 'OK',
  },

  {
    id: 'app.arch.operation.be_cancel',
    defaultMessage: '取消',
    en: 'Cancel',
  },
  {
    id: 'app.arch.operation.new_location',
    defaultMessage: '新增場館',
    en: 'New Location',
  },
  {
    id: 'app.arch.form.department_chinese_name',
    defaultMessage: '部門名稱（中文）',
    en: 'Department(Chinese)',
  },
  {
    id: 'app.arch.form.sup_department',
    defaultMessage: '上級部門',
    en: 'SupDepartment',
  },
  {
    id: 'app.arch.form.department_english_name',
    defaultMessage: '部門名稱（英文）',
    en: 'Department(Englist)',
  },
  {
    id: 'app.arch.form.locations_label',
    defaultMessage: '所屬場館',
    en: 'Locations',
  },
  {
    id: 'app.arch.form.department_of_all',
    defaultMessage: '全部',
    en: 'All',
  },
  {
    id: 'app.arch.form.location_of_office',
    defaultMessage: '辦公室',
    en: 'Office',
  },
  {
    id: 'app.arch.form.location_of_vip',
    defaultMessage: '貴賓廳',
    en: 'VIP',
  },
  {
    id: 'app.arch.form.remark_label',
    defaultMessage: '備註',
    en: 'Remark',
  },
  {
    id: 'app.arch.form.no_sup_department',
    defaultMessage: '無上級部門',
    en: 'No SupDepartment',
  },
  {
    id: 'app.arch.form.position_chinese_name',
    defaultMessage: '職位名稱（中文）',
    en: 'Position(Chinese)',
  },
  {
    id: 'app.arch.form.position_english_name',
    defaultMessage: '職位名稱（英文）',
    en: 'Position(English)',
  },
  {
    id: 'app.arch.form.sup_position',
    defaultMessage: '上級職位',
    en: 'SupPosition',
  },
  {
    id: 'app.arch.form.position_level',
    defaultMessage: '職級',
    en: 'Position Level',
  },
  {
    id: 'app.arch.form.departments_label',
    defaultMessage: '* 所屬部門',
    en: 'Departments',
  },
  {
    id: 'app.arch.form.no_sup_position',
    defaultMessage: '無上級職位',
    en: 'No SupPosition',
  },
  {
    id: 'app.arch.form.location_chinese_name',
    defaultMessage: '場館名稱（中文）',
    en: 'Location(Chinese)',
  },
  {
    id: 'app.arch.form.location_english_name',
    defaultMessage: '場館名稱（英文）',
    en: 'Location(English)',
  },
  {
    id: 'app.arch.form.sup_location',
    defaultMessage: '上級場館',
    en: 'SupLocation',
  },
  {
    id: 'app.arch.form.no_sup_location',
    defaultMessage: '無上級場館',
    en: 'No SupPosition',
  },

  {
    id: 'app.arch.form.please_choose_location',
    defaultMessage: '請選擇場館',
    en: 'Please choose location',
  },
  {
    id: 'app.my_recruit.tabpanel.prev',
    defaultMessage: '上一頁',
    en: 'Previous Page',
  },

  {
    id: 'app.my_recruit.tabpanel.title',
    defaultMessage: '我的招聘',
    en: 'My Recruit',
  },

  {
    id: 'app.my_recruit.tabpanel.for_screening',
    defaultMessage: '待篩選',
    en: 'For Screening',
  },

  {
    id: 'app.my_recruit.tabpanel.my_interviews',
    defaultMessage: '我的面試',
    en: 'My Interviews',
  },

  {
    id: 'app.my_recruit.tag_card.choose_needed',
    defaultMessage: '待確認',
    en: 'Choose Needed',
  },

  {
    id: 'app.my_recruit.tag_card.choose_agreed',
    defaultMessage: '已同意',
    en: 'Choose Agreed',
  },

  {
    id: 'app.my_recruit.tag_card.choose_refused',
    defaultMessage: '已拒絕',
    en: 'Choose Refused',
  },

  {
    id: 'app.my_recruit.tag_card.interview_needed',
    defaultMessage: '待確認',
    en: 'Interview Needed',
  },

  {
    id: 'app.my_recruit.tag_card.interview_agreed',
    defaultMessage: '已同意',
    en: 'Interview Agreed',
  },

  {
    id: 'app.my_recruit.tag_card.interview_refused',
    defaultMessage: '已拒絕',
    en: 'Interview Refused',
  },

  {
    id: 'app.my_recruit.tag_card.interview_completed',
    defaultMessage: '已完成',
    en: 'Interview Completed',
  },

  {
    id: 'app.my_recruit.tag_card.interview_canceled',
    defaultMessage: '已取消',
    en: 'Interview Canceled',
  },

  {
    id: 'app.my_recruit.tag_card.apply_department',
    defaultMessage: '應徵部門',
    en: 'Apply Department',
  },

  {
    id: 'app.my_recruit.tag_card.apply_position',
    defaultMessage: '應徵職位',
    en: 'Apply Position',
  },

  {
    id: 'app.my_recruit.tag_card.applicant_no',
    defaultMessage: '求職者編號',
    en: 'Applicant NO',
  },

  {
    id: 'app.my_recruit.tag_card.sex',
    defaultMessage: '性別',
    en: 'Sex',
  },

  {
    id: 'app.global.remark',
    defaultMessage: '備註:',
    en: 'Remark:',
  },

  {
    id: 'app.my_recruit.card_content.remark',
    defaultMessage: '備註:',
    en: 'Remark:',
  },

  {
    id: 'app.my_recruit.card_content.interview_agree_remark',
    defaultMessage: '備註:',
    en: 'Remark:',
  },

  {
    id: 'app.my_recruit.card_content.interview_refuse_remark',
    defaultMessage: '備註:',
    en: 'Remark:',
  },

  {
    id: 'app.my_recruit.card_content.choose_agree_remark',
    defaultMessage: '備註:',
    en: 'Remark:',
  },

  {
    id: 'app.my_recruit.card_content.choose_refuse_remark',
    defaultMessage: '備註:',
    en: 'Remark:',
  },


  {
    id: 'app.my_recruit.card_content.interview_time',
    defaultMessage: '面試時間:',
    en: 'Interview Time:',
  },

  {
    id: 'app.my_recruit.card_content.interviewers',
    defaultMessage: '面試官:',
    en: 'Interviewer:',
  },

  {
    id: 'app.my_recruit.card_content.interview_result',
    defaultMessage: '面試結果:',
    en: 'Result:',
  },

  {
    id: 'app.my_recruit.card_content.interview_score',
    defaultMessage: '面試評分:',
    en: 'Score:',
  },

  {
    id: 'app.my_recruit.card_content.interview_evaluation',
    defaultMessage: '面試評價:',
    en: 'Evaluation:',
  },

  {
    id: 'app.my_recruit.card_content.view_button',
    defaultMessage: '查看',
    en: 'View',
  },

  {
    id: 'app.my_recruit.card_content.cancel_reason',
    defaultMessage: '取消原因:',
    en: 'Cancel Reason:',
  },

  {
    id: 'app.my_recruit.card_content.interview_round',
    defaultMessage: '面試輪次:',
    en: 'Round:',
  },

  {
    id: 'app.my_recruit.card_content.applicant_info',
    defaultMessage: '求職者信息:',
    en: 'Applicant Info:',
  },

  {
    id: 'app.my_recruit.card_content.applicant_chinese_name',
    defaultMessage: '求職者姓名（中）:',
    en: 'Name(Chinese):',
  },

  {
    id: 'app.my_recruit.card_content.applicant_english_name',
    defaultMessage: '求職者姓名（英）:',
    en: 'Name(English):',
  },

  {
    id: 'app.my_recruit.card_content.interview_info',
    defaultMessage: '面試信息:',
    en: 'Interview Info:',
  },

  {
    id: 'app.my_recruit.card_modal.agree_choose',
    defaultMessage: '接見',
    en: 'Agree',
  },

  {
    id: 'app.my_recruit.card_modal.refuse_choose',
    defaultMessage: '拒絕',
    en: 'Refuse',
  },

  {
    id: 'app.my_recruit.card_modal.agree_interview',
    defaultMessage: '同意',
    en: 'Agree',
  },

  {
    id: 'app.my_recruit.card_modal.refuse_interview',
    defaultMessage: '拒絕',
    en: 'Refuse',
  },

  {
    id: 'app.my_recruit.card_modal.complete_interview',
    defaultMessage: '完成',
    en: 'Complete',
  },

  {
    id: 'app.my_recruit.card_modal.modify_interview',
    defaultMessage: '修改',
    en: 'Modify',
  },

  {
    id: 'app.my_recruit.card_modal.sure_to_choose',
    defaultMessage: '確認接見:',
    en: 'Sure to choose:',
  },

  {
    id: 'app.my_recruit.card_modal.suggest_time',
    defaultMessage: '請填寫幾個建議的面試時間段:',
    en: 'Suggest interview time:',
  },

  {
    id: 'app.my_recruit.card_modal.refuse_reason',
    defaultMessage: '請填寫拒絕的原因:',
    en: 'Refuse reason:',
  },

  {
    id: 'app.my_recruit.card_modal.need_more',
    defaultMessage: '需要後續面試:',
    en: 'Need more:',
  },

  {
    id: 'app.my_recruit.card_modal.please_choose',
    defaultMessage: '請選擇:',
    en: 'Please choose:',
  },

  {
    id: 'app.my_recruit.card_modal.fill_in_result',
    defaultMessage: '填寫面試結果:',
    en: 'Fill in result:',
  },

  {
    id: 'app.my_recruit.card_modal.modify_result',
    defaultMessage: '修改面試結果:',
    en: 'Modify result:',
  },

  {
    id: 'app.my_recruit.card_modal.absent',
    defaultMessage: '未出席面試',
    en: 'Absent',
  },

  {
    id: 'app.my_recruit.card_modal.not_suitable',
    defaultMessage: '暫不考慮',
    en: 'Not suitable',
  },

  {
    id: 'app.my_recruit.card_modal.pass_pt1',
    defaultMessage: '通過',
    en: 'Pass',
  },

  {
    id: 'app.my_recruit.card_modal.pass_pt2',
    defaultMessage: '次面試',
    en: 'interview',
  },

  {
    id: 'app.messages.tabpanel.messages_title',
    defaultMessage: '我的消息',
    en: 'My Messages',
  },

  {
    id: 'app.messages.tabpanel.prev',
    defaultMessage: '上一頁',
    en: 'Previous',
  },

  {
    id: 'app.messages.tabpanel.notifications',
    defaultMessage: '通知',
    en: 'Notifications',
  },

  {
    id: 'app.messages.tabpanel.tasks',
    defaultMessage: '任務',
    en: 'Tasks',
  },

  {
    id: 'app.messages.message_board.mark_all',
    defaultMessage: '全部已讀',
    en: 'Mark All',
  },

  {
    id: 'app.global.more_messages',
    defaultMessage: '查看更多',
    en: 'More',
  },

  {
    id: 'app.job_application.contract.delete_button',
    defaultMessage: '刪除',
    en: 'Delete',
  },

  {
    id: 'app.job_application.contract.export_button',
    defaultMessage: '匯出',
    en: 'Export',
  },

  {
    id: 'app.job_application.contract.modal_title',
    defaultMessage: '是否確認刪除此合約？',
    en: 'Are you sure to delete this contract?',
  },

  {
    id: 'app.job_application.contract.modal_content',
    defaultMessage: '刪除合約後，數據將無法恢復：合約',
    en: 'Data can not be restored after deleting this contract:',
  },

  {
    id: 'app.job_application.contract.operator',
    defaultMessage: '創建人',
    en: 'Operator',
  },

  {
    id: 'app.job_application.contract.created_at',
    defaultMessage: '創建時間',
    en: 'Time',
  },

  {
    id: 'app.applicant_all.applicant_profile',
    defaultMessage: '個人資料',
    en: 'Applicant Profile',
  },

  {
    id: 'app.applicant_all.job_application',
    defaultMessage: '職位申請',
    en: 'Job Application',
  },

  {
    id: 'app.job_application.not_null',
    defaultMessage: '该字段不能为空',
    en: 'the field cannot be null',
  },

  {
    id: 'app.job_application.email_not_exist',
    defaultMessage: '该邮箱不存在',
    en: 'Sorry, the email does not exist!',
  },

  {
    id: 'app.applicant_profile.for_screening',
    defaultMessage: '待篩選',
    en: 'For Screening',
  },

  {
    id: 'app.applicant_profile.waiting_interviews',
    defaultMessage: '待面試',
    en: 'Waiting For Interview',
  },

  {
    id: 'app.applicant_profile.contract_needed',
    defaultMessage: '待簽約',
    en: 'Contract Needed',
  },

  {
    id: 'app.applicant_profile.entry_needed',
    defaultMessage: '待入職',
    en: 'Entry Needed',
  },

  {
    id: 'app.applicant_profile.applicant_information',
    defaultMessage: '求職者資料',
    en: 'Applicant information',
  },

  {
    id: 'app.applicant_profile.block.applicant_number',
    defaultMessage: '求職者資料',
    en: 'Applicant information',
  },



  {
    id: 'app.role_list.title',
    defaultMessage: '權限管理',
    en: 'Roles',
  },
  {
    id: 'app.suncity_finder_file_list.no_select',
    defaultMessage: '未選擇',
    en: 'noSelect',
  },
];

export default messages;
