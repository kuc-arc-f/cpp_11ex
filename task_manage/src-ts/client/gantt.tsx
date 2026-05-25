import React, { useState, useEffect , useMemo } from 'react';
import Container from '../components/Container'
import GanttHelper from "./gantt/GanttHelper"
import LibConfig from "./lib/LibConfig"

let projectId = 0;

export default function App() {
  const [tasks, setTasks] = useState<[]>([]);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2026);
  // We'll focus the calendar on May 2026 to match the sample data
  const daysInView = 90; // Matching the 25 columns shown in the screenshot exactly
  
  const getTaskList = () => {
      GanttHelper.taskList(
        projectId, setTasks , setMonth ,setYear
      );
  }
  useEffect(() => {
    (async () => {
      const id = sessionStorage.getItem(LibConfig.STORAGE_KEY_PROJECT_ID)
      projectId = Number(id);
      console.log("projectId=" , projectId);
      getTaskList();
    })()
  }, []);

  const dates = useMemo(() => {
    return Array.from({ length: daysInView }).map((_, i) => {
      return new Date(year, month - 1, i + 1);
    });
  }, [month, year]);

  const isWithinDate = (targetDate: Date, startStr: string, endStr: string) => {
    // Safely format local date to YYYY-MM-DD string to avoid timezone shifts
    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const d = String(targetDate.getDate()).padStart(2, '0');
    const targetStr = `${y}-${m}-${d}`;

    return targetStr >= startStr && targetStr <= endStr;
  };

  // Reverse tasks so the last created are at the top, matching the picture's layout
  const displayTasks = [...tasks].reverse();

  return (
  <Container>
    {/* flex items-center  */}
    <div className="min-h-screen bg-[#f3f4f6]  w-full flex flex-1 justify-center p-4 sm:p-2 font-sans">
      <div className="bg-white border border-gray-300 rounded shadow-sm w-full max-w-6xl p-4 sm:p-6 min-h-[500px]">
        
        {/* Window-like top bar matching reference */}
        {/*
        <div className="text-sm text-gray-800 mb-6 font-medium">
          [ home ]
        </div>
        <button className="px-5 py-2 border border-gray-200 rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm mb-6 text-sm font-medium transition-colors">
          Back
        </button>
        */}

        <h1 className="text-3xl text-[#1f2937] font-semibold mb-6 px-1 tracking-tight">Gantt</h1>
        <div className="text-center">
          <button 
          className="inline-flex items-center gap-2 px-4 py-2 mb-2 bg-blue-400 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          onClick={()=>{
            GanttHelper.excelExport(projectId);
          }}>Excel Export</button>
        </div>

        <div className="overflow-x-auto">
          <table className="border-collapse border border-gray-400 w-max text-sm min-w-full table-fixed">
            <thead>
              <tr>
                <th className="border border-gray-400 bg-[#f8fafc] w-64 min-w-[16rem] px-4 py-2 text-left font-normal text-gray-800">
                  {/* Empty corner cell */}
                </th>
                {dates.map((date, idx) => (
                  <th 
                    key={idx} 
                    className="border border-gray-400 bg-[#e8f5e9] w-[34px] min-w-[34px] text-center font-normal px-0 py-1"
                  >
                    <div className="text-[11px] leading-tight text-gray-800">{date.getMonth()+1}</div>
                    <div className="text-[11px] leading-tight text-gray-800">{date.getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayTasks.map(task => (
                <tr key={task.id}>
                  <td className="border border-gray-400 px-3 py-1.5 text-[13px] text-gray-900 font-medium whitespace-nowrap bg-white">
                    {task.title}
                  </td>
                  {dates.map((date, idx) => {
                    const isBlue = isWithinDate(date, task.start_date, task.end_date);
                    return (
                      <td 
                        key={idx} 
                        className={`border border-gray-400 p-0 m-0 ${isBlue ? 'bg-[#5b9bd5]' : 'bg-white'}`}
                        style={{ height: '28px' }}
                      >
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <hr className="mt-12 border-gray-400/60" />
      </div>
    </div>
  </Container>  

  );
}
