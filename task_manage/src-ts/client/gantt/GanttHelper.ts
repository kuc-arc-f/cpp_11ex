import dayjs from "dayjs"
import GanttCommon from "./GanttCommon";

const GanttHelper = {

  taskList: (
    projectId, setTasks, setMonth ,setYear
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
                const end_msec = dt.valueOf(); 
                console.log("end_msec=", end_msec)
                console.log(dt.format("YYYY-MM-DD"))
                const startDt = dayjs(element.start_date)
                 const start_msec = startDt.valueOf(); 
                console.log("start_msec=", start_msec)
                element.end_date = dt.format("YYYY-MM-DD");
                element.start_date = startDt.format("YYYY-MM-DD");
                out.push(element)
              }); 
              const minDt = GanttCommon.getMinYear(out); 
              const dt2 = dayjs(minDt)            
              const dt2yy =  dt2.format("YYYY");
              const dt2mm =  dt2.format("MM");
              console.log("dt2yy=", dt2yy)
              console.log("dt2mm=", dt2mm)
              setYear(Number(dt2yy))
              setMonth(Number(dt2mm))
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

  excelExport: (
    projectId
  ) =>{
    try{    
      const inData = {
        projectId: projectId
      }
      const target = {
        action: "gantt_excel_export",
        path: "/api/task_item/list",
        data: JSON.stringify(inData)
      }  
      const sendJson = JSON.stringify(target)        
      console.log(sendJson) 
                
      if (window.chrome && window.chrome.webview) {
        const eventHandler = (event) => {
          const resp = event.data;
          console.log(resp)
          if(resp){
            const j1 = JSON.parse(resp)
            console.log(j1)
            if(j1.ret === 200){
              const j2 = JSON.parse(j1.data)
              console.log(j1.data)
              alert("compete save , gantt_chart.xlsx");
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
