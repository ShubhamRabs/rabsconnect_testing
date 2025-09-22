import * as Yup from 'yup';
import dayjs from "dayjs";

const validationSchema = Yup.object().shape({
    ldate_from:Yup.date(),
    ldate_to:Yup.string().when('ldate_from', (ldate_from, schema) => {
        if (!ldate_from[0]) {
          return schema;
        }
        return ldate_from && schema.test('Lead Date To', 'Lead Date To must be greater than Lead Date From', function(value) {
          return dayjs(value).isAfter(ldate_from);
        }).required('Lead Date To is required');
      }),
      fdate_from:Yup.date(),
      fdate_to:Yup.string().when('fdate_from', (fdate_from, schema) => {
          if (!fdate_from[0]) {
            return schema;
          }
          return fdate_from && schema.test('Follow Up Date To', 'Follow Up Date To must be greater than Follow Up Date From', function(value) {
            return dayjs(value).isAfter(fdate_from);
          }).required('Follow Up Date To is required');
        }),  
});

export default validationSchema;
