/**
 * Created by meng on 16/8/24.
 */
import { Seq } from 'immutable';
import qs from 'qs';
import _ from 'lodash';

//remove empty value params attribute
function filterParams(params){
  return Seq(params)
          .filter((item) => {
            return item !== null;
          }).toObject();
}

export function jsonToQuery(params){
  return '?' + qs.stringify(
    filterParams(_.pickBy(params)),
    { arrayFormat: 'brackets' }
  );
}
