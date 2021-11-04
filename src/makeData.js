export default async function makeData(setData) {
    const url = 'http://127.0.0.1:8000/api/student_data';
    const response = await fetch(url);
    const data = await response.json();
    const final_data = await data.map(row => {
      
      return row.fields
   })
   console.log(final_data)
    return setData(final_data)
  }
