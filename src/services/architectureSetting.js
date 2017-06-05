import request from '../utils/request';
import { requestSimple as req } from 'utils/request';
import { HOST } from '../constants/APIConstants';

/* const HOST = 'https://suncity-backend.ylemon.tech'; */

const fillIt = (str, chr, len) => {
  const tmpStr = new Array(len).join(chr).concat(`${str}`.replace(/^\s*/, ''));
  return tmpStr.substring(tmpStr.length - len);
}

export async function fetchListByType(type, region) {
  return request(`${HOST}/${type}?region=${region}&with_disabled=true`, {
    method: 'GET',
  });
}

export async function fetchTreeByType(type) {
  return request(`${HOST}/${type}/tree`, {
    method: 'GET',
  });
}

export async function getDepartmentDetail(id) {
  const departmentUrl = `${HOST}/departments/${id}`;
  return request(departmentUrl, {
    method: 'GET',
  });
}

export async function getPositionDetail(id) {
  const departmentUrl = `${HOST}/positions/${id}`;
  return request(departmentUrl, {
    method: 'GET',
  });
}

export async function updateStatusTo(status, type, id, token) {
  /* const url = `${HOST}/${type}/${id}/${status}`; */
  /* return request(url, {
     method: 'PATCH',
     token,
     });
   */
  return req({
    url: `/${type}/${id}/${status}`,
    token,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    host: HOST,
  });

}

export async function createDataOf(type, postData, token) {
  /* const url = `${HOST}/${type}`;
     return request(url, {
     method: 'POST',
     headers: {
     'Content-Type': 'application/json',
     },
     body: JSON.stringify(postData),
     });
   */

  return req({
    url: `/${type}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: postData,
    token,
    host: HOST,
  });
}

export async function updateDataOf(type, patchData, id, token) {
  /* const url = `${HOST}/${type}/${id}`;
     return request(url, {
     method: 'PATCH',
     headers: {
     'Content-Type': 'application/json',
     },
     body: JSON.stringify(patchData),
     });
   */

  return req({
    url: `/${type}/${id}`,
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: patchData,
    token,
    host: HOST,
  });
}

export async function deleteDataOf(type, id) {
  const url = `${HOST}/${type}/${id}`;
  return request(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getId(listData) {
  let ids = listData.map(item => item.id).sort((x, y) => {
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });
  return (ids[ids.length - 1] + 1);
}

export function completeDeptPostData(postData) {
  return Object.assign({}, postData, {
    header_name: '--',
    employees_count: 0,
  });
}

export function completePosiData(data, list, id) {
  const newId = id !== undefined ? id : data.id;

  const departmentIds = data.department_ids;
  let deptNames = '--';

  if (departmentIds && departmentIds.length > 0) {
    let deptNamesArray = [];

    for (let deptId of departmentIds) {
      const dept = list.filter(dept => dept.id === deptId);
      deptNamesArray = [...deptNamesArray, dept[0].chinese_name];
    }
    deptNames = deptNamesArray.join(' / ');
  }

  const chineseName = `${data.chinese_name} (${fillIt(newId, 0, 3)})`;
  const englishName = `${data.english_name} (${fillIt(newId, 0, 3)})`;

  return Object.assign({}, data, {
    chinese_name: chineseName,
    english_name: englishName,
    department_names: deptNames,
  });
}

export function completeLocaPostData(postData, region) {
  const pId = region === 'macau' ? 32 : 70;
  return Object.assign({}, postData, {
    parent_id: pId,
    status: undefined,
  });
}

function getItemById(items, id) {
  return items.find(item => item.id === id);
}

export function fillInDataToTheTree(data, tree, depth) {
  const result = tree.map(item => {
    const fullItem = getItemById(data, item.id);
    if (item.children.length === 0) {
      return fullItem === undefined || depth === 2 ? fullItem : Object.assign({}, fullItem, {
        children: [],
      });
    }
    return Object.assign({}, fullItem, {
      children: fillInDataToTheTree(data, item.children, depth + 1),
    });
  });
  return result.filter(value => value !== undefined);
}

export function createDataInTheTree(oldTree, postData) {
  const newTree = oldTree.map(node => {
    if (node.id === parseInt(postData.parent_id)) {
      return Object.assign({}, node, {
        children: [ ...node.children, postData ],
      });
    }

    if (node.children && node.children.length !== 0) {
      return Object.assign({}, node, {
        children: createDataInTheTree(node.children, postData)
      });
    }
    return node;
  });
  return newTree.filter(value => value !== undefined);
}

export function updateDataInTheTree(oldTree, patchData, id) {
  const newTree = oldTree.map(node => {
    if (node.id === id) {
      return Object.assign({}, node, {
        ...patchData,
      });
    }

    if (node.children && node.children.length !== 0) {
      return Object.assign({}, node, {
        children: updateDataInTheTree(node.children, patchData, id)
      });
    }
    return node;
  });
  return newTree.filter(value => value !== undefined);
}

export function updateDepartmentInPositionTree(oldTree, patchData, id) {
  const newTree = oldTree.map(node => {
    const departmentIds = node.department_ids;

    if (departmentIds.indexOf(id) >= 0) {
      const loc = departmentIds.indexOf(id);
      let departmentNames = node.department_names;
      let deptNamesArray = departmentNames.split(' / ');
      deptNamesArray[loc] = patchData.chinese_name;
      departmentNames = deptNamesArray.join(' / ');

      return Object.assign({}, node, {
        department_names:  departmentNames,
      });
    }

    if (node.children && node.children.length !== 0) {
      return Object.assign({}, node, {
        children: updateDepartmentInPositionTree(node.children, patchData, id)
      });
    }
    return node;
  });
  return newTree.filter(value => value !== undefined);
}


export function deleteDataInTheTree(oldTree, id) {
  let newTree = oldTree.filter(node => node.id !== id);
  if (newTree.length < oldTree.length) {
    return newTree;
  } else {
    const newTree = oldTree.map(node => {
      if (node.children && node.children.length !== 0) {
        return Object.assign({}, node, {
          children: deleteDataInTheTree(node.children, id)
        });
      }
      return node;
    });
    return newTree;
  }
}

export function updateStatusInTheTree(oldTree, status, id) {
  const newTree = oldTree.map(node => {
    if (node.id === id) {
      return Object.assign({}, node, {
        status: `${status}d`
      });
    }

    if (node.children && node.children.length !== 0) {
      return Object.assign({}, node, {
        children: updateStatusInTheTree(node.children, status, id)
      });
    }
    return node;
  });
  return newTree.filter(value => value !== undefined);
}

export function sortById(item1, item2) {
  if (item1.id >= item2.id) {
    return 1;
  }
  if (item1.id < item2.id) {
    return -1;
  }
}

export function sortByTime(item1, item2) {
  if (item1.created_at === undefined || item1.created_at >= item2.created_at) {
    return 1;
  }
  if (item1.created_at < item2.created_at) {
    return -1;
  }
}

export function sortByStatus(item1, item2) {
  if (item1.status === item2.status) {
    return sortById(item1, item2);
  }

  if (item1.status < item2.status) {
    return 1;
  }
  if (item1.status > item2.status) {
    return -1;
  }
}

export function sortTreeBy(rule, dataTree) {
  if (dataTree.length === 1 && dataTree[0].children) {
    dataTree[0].children = sortTreeBy(rule, dataTree[0].children);
    return dataTree;
  } else {
    return dataTree.sort((item1, item2) => {
      if (item1.children && item1.children.length !== 0 ) {
        sortTreeBy(rule, item1.children);
      }
      if (item2.children && item2.children.length !== 0 ) {
        sortTreeBy(rule, item2.children);
      }

      if (rule === 'status') {
        return sortByStatus(item1, item2);
      } else if (rule === 'time') {
        return sortById(item1, item2);
      }
      return 0;
    })
  }
}

export function notLevelThree(dataList, item) {
  if (item.parent_id === null) {
    return true;
  }

  if (item.parent_id !== null) {
    const tmp = dataList.find(x => x.id === item.parent_id);

    if (!tmp) {
      return false;
    }

    if (tmp.parent_id === null) {
      return true;
    }
  }
  return false;
}
