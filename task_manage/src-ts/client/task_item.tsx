
import React, { useState, useEffect } from 'react';
import { PlusCircle, CheckSquare } from 'lucide-react';
import { useTasks } from './hooks/useTasks';
import { TaskDialog } from './task_item/TaskDialog';
import { TaskCard } from './task_item/TaskCard';
import { Task } from './types';
import { AnimatePresence, motion } from 'motion/react';
import Container from '../components/Container'
import TaskHelper from "./task_item/TaskHelper"
import LibConfig from "./lib/LibConfig"

let projectId = 0;

export default function App() {
  const { addTask, updateTask, deleteTask } = useTasks();
  const [tasks, setTasks] = useState<[]>([]);
  const [statTasks1, setStatTasks1] = useState<[]>([]);
  const [statTasks2, setStatTasks2] = useState<[]>([]);
  const [statTasks3, setStatTasks3] = useState<[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const getTaskList = () => {
      TaskHelper.taskList(
        projectId, setStatTasks1, setStatTasks2, setStatTasks3, setTasks
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

  const handleOpenNew = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleSave = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    taskData.projectId = projectId;
    taskData.complete = taskData.end_date;
    taskData.userId = 0;
    if (editingTask) {
      console.log(editingTask)
      taskData.id = editingTask.id;
      console.log(taskData)
      TaskHelper.taskUpdate(taskData, getTaskList);
    } else {
      console.log(taskData)
      TaskHelper.taskAdd(taskData, getTaskList)
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
      TaskHelper.taskDelete(id, getTaskList)
    }
  };

  return (
  <Container>  
    <div className="w-full min-h-screen bg-gray-50 font-sans">      
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-900">
            <CheckSquare className="text-blue-600" size={24} />
            <h1 className="text-xl font-bold tracking-tight">Tasks</h1>
          </div>
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <PlusCircle size={18} />
            <span className="hidden sm:inline">New Task</span>
          </button>
        </div>        
      </div>  

      {/* main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tasks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-20 bg-white border border-gray-200 border-dashed rounded-2xl"
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
              <CheckSquare size={32} />
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-1">No tasks yet</h2>
            <p className="text-gray-500 mb-6 max-w-sm">
              Get started by creating your first task to keep track of your work and projects.
            </p>
            <button
              onClick={handleOpenNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors shadow-sm"
            >
              <PlusCircle size={18} />
              Create Task
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-row">
            {/* status-col */}
            <div className="flex-1 text-center p-2 m-1">
              <div className="text-lg font-bold text-blue-600">None</div>
              {statTasks1.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              ))}              
            </div>
            <div className="flex-1 text-center p-2 m-1">
              <div className="text-lg font-bold text-blue-600">Working</div>
              {statTasks2.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              ))}              
            </div>
            <div className="flex-1 text-center p-2 m-1">
              <div className="text-lg font-bold text-blue-600">Complete</div>
              {statTasks3.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              ))}              
            </div>
          </div>     
        )}
      </main>

      {/* Task Dialog Portal */}
      <TaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        initialData={editingTask}
      />
    </div>
  </Container>
  );
}

