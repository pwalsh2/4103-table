export  async function makeData(setData) {
    const url = 'http://127.0.0.1:8000/api/student_data';
    const response = await fetch(url);
    const data = await response.json();
    const final_data = await data.map(row => {
      
      return row.fields
   })
   console.log(final_data)
    return setData(final_data)
  }

  export async function makeTranscript(key, setData) {
    if(key.length !== 0){
      console.log(key);
      const url = "http://127.0.0.1:8000/get_transcript/" + key[0] + "";
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
  
      return setData(data);
    }

	}