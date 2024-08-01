import { User } from '../models/userModel';
import { ToDo,IToDo } from '../models/toDoModel';
import sendEmail from '../services/emailService';

// Function to generate task summaries for all users
export const generateTaskSummary = async (): Promise<void> => {
  const users = await User.find({});
  for (const user of users) {
    
    console.log(`Sending task summary to user: ${user.email}`);

    const toDos = await ToDo.find({ userId: user._id });
    await sendEmail( user.email,'Daily Task Summary',toDos);
  }
};


// Function to delete expired or completed tasks
export const deleteExpiredTasks = async (): Promise<void> => {
  const result = await ToDo.deleteMany({ isCompleted: true });
  console.log(`Deleted ${result.deletedCount} completed tasks`);
};

// Function to generate task reports
export const generateTaskReports = async (): Promise<void> => {
  const users = await User.find({});
  for (const user of users) {
    const toDos = await ToDo.find({ userId: user._id });
    const completedTasks = toDos.filter(task => task.isCompleted);
    const pendingTasks = toDos.filter(task => !task.isCompleted);
    console.log(`${completedTasks.length} completed tasks and ${pendingTasks.length} pending tasks for user ${user.name}`);
  }
};


