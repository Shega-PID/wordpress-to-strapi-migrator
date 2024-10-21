export const mapFields = (data:any,fields:string[]) => {
    const result = {};
    fields.forEach((field) => {
      const [key, value] = field.split(':');
      result[key] = data?.[value];
    });
    return result;
  };
  
export const mapFieldsNest = (data: any, fields: any[]) => {
  const result: any = {};

  fields.forEach((field) => {
    const [key, value] = field.split(':');

    if (key === 'seo') {
      const nestedSeo = value
        .replace(/^\[|\]$/g, '')  
        .replace(/'/g, '')       
        .split(',')               
        .map(item => item.trim().replace('-', ':')); 

      result[key] = {}; 

      nestedSeo.forEach((nestedField) => {
        const [nestedKey, nestedValue] = nestedField.split(':');
        result[key][nestedKey] = data?.[nestedValue]; 
      });
    } else {
      result[key] = data?.[value];
    }
  });

  return result;
};



  
    
   
    

  

  

  
    
  
    

    
 
    
    
  
  

  
 
  
  

  