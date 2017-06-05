import { requestSimple } from 'utils/request';
import dateFormat from "dateformat";
function transferEndpoint(endpoint) {
  switch (endpoint) {
    case 'applicantPositionState':
    return 'applicant_positions/statuses';
    default:
    return endpoint;
  }
}

export default async function({ endpoint, region }) {
  endpoint = transferEndpoint(endpoint);
  switch (endpoint) {
    case 'grade':
    return  {data: [1, 2, 3, 4, 5, 6].map(grade => {
      return {
        chinese_name: grade,
        english_name: grade,
        key: grade,
        id: grade,
      }
    })}
    case 'jobState':
    return {data: [
      {
        chinese_name: '正在招聘',
        english_name: 'Enabled',
        id: 'enabled'
      },
      {
        chinese_name: '停止招聘',
        english_name: 'Disabled',
        id: 'disabled'
      }
    ]};
    case 'applicationProfileSource':
    return {data: [
      {
        chinese_name: '官網申請',
        english_name: 'website',
        id: 'website'
      },
      {
        chinese_name: 'iPad',
        english_name: 'iPad',
        id: 'ipad'
      },
      {
        chinese_name: '手動新增',
        english_name: 'Manual',
        id: 'manual'
      }
    ]};
    default:
    let params = {
      region: region,
      pagination: false,
    };

    let meta = {};

    const response = await requestSimple({
      url: "/" + endpoint,
      method: 'GET',
      params
    });

    const data = response.data.data;
    if(endpoint.indexOf('same_id_card_number_profiles') != -1) {
      return {
        data: data.map(profile => {
          const date = new Date(profile.created_at);
          return {
            ...profile,
            created_at: dateFormat(date, 'yyyy/mm/dd')
          };
        })
      };
    }

    if(endpoint == 'jobs') {
      meta.readOnly = data.filter(item => item.status == 'disabled')
    }

    return { data, meta };
  }
}
