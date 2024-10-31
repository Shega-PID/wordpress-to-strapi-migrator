"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapFieldsNest = exports.mapFields = void 0;
const mapFields = (data, fields) => {
    const result = {};
    fields.forEach((field) => {
        const [key, value] = field.split(':');
        result[key] = data === null || data === void 0 ? void 0 : data[value];
    });
    return result;
};
exports.mapFields = mapFields;
//   export const mapFieldsNest = (data: any, fields: any[]) => {
//     const result: any = {};
//     const nested:any={};
//   let nest={}
//     fields.forEach((field) => {
//       const [key, value] = field.split(':');
//       const seo=field.split(':')[1]
//       const nestedSeo= seo.replace(/^\[|\]$/g, '') 
//       .replace(/'/g, '')        
//       .split(',')             
//       .map(item => item.trim().replace('-', ':'));
// nest=nestedSeo
//       if(nestedSeo.length){
//         nestedSeo.forEach((nestField) =>{
//           const[nKey,nValue]=nestField.split(':')
//           nested[nKey]=data?.[nValue]
//         })
//       }else{
//         result[key] = data?.[value];
//       }
//      });
//     return {...result,nest:nest,};
//   };
const mapFieldsNest = (data, fields) => {
    const result = {};
    fields.forEach((field) => {
        const [key, value] = field.split(':');
        // Always handle the 'seo' field as nested
        if (key === 'seo') {
            const nestedSeo = value
                .replace(/^\[|\]$/g, '')
                .replace(/'/g, '')
                .split(',')
                .map(item => item.trim().replace('-', ':'));
            result[key] = {};
            nestedSeo.forEach((nestedField) => {
                const [nestedKey, nestedValue] = nestedField.split(':');
                result[key][nestedKey] = data === null || data === void 0 ? void 0 : data[nestedValue];
            });
        }
        else {
            result[key] = data === null || data === void 0 ? void 0 : data[value];
        }
    });
    return result;
};
exports.mapFieldsNest = mapFieldsNest;
