import dayjs from "dayjs"

const GanttHelper = {

  taskList: (
    projectId, setTasks
  ) =>{
    try{    
      const inData = {
        projectId: projectId
      }
      const target = {
        action: "task_item_list",
        path: "/api/task_item/list",
        data: JSON.stringify(inData)
      }  
      const sendJson = JSON.stringify(target)        
      console.log(sendJson) 
                
      if (window.chrome && window.chrome.webview) {
        const eventHandler = (event) => {
          const resp = event.data;
          if(resp){
            const j1 = JSON.parse(resp)
            //console.log(j1)
            if(j1.ret === 200){
              const j2 = JSON.parse(j1.data)
              console.log(j2.data)
              const out = []
              j2.data.forEach((element) => {
                let row = element;
                const dt = dayjs(element.complete)
                console.log(dt.format("YYYY-MM-DD"))
                const startDt = dayjs(element.start_date)
                element.end_date = dt.format("YYYY-MM-DD");
                element.start_date = startDt.format("YYYY-MM-DD");
                out.push(element)
              });              
              setTasks(out)
            }else{
              console.log("resp=" + resp)
            }
          }
          window.chrome.webview.removeEventListener('message', eventHandler);
        }
        window.chrome.webview.addEventListener('message', eventHandler);
        window.chrome.webview.postMessage(sendJson);        
      }
    } catch (error) {
      throw new Error(error)
    }
  }, 

}
export default GanttHelper;
