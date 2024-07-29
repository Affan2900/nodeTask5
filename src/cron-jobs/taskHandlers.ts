import { User } from '../models/userModel';
import { ToDo,IToDo } from '../models/toDoModel';
import sendEmail from '../services/emailService';
type ToDo = typeof ToDo;

// Function to generate task summaries for all users
export const generateTaskSummary = async (): Promise<void> => {
  const users = await User.find({});
  for (const user of users) {
    // Dummy email logic: Add an entry in the database
    console.log(`Sending task summary to user: ${user.email}`);
    // Add your logic to generate and save task summaries
    await sendEmail(user.email, user.password, user.name, 'Daily Task Summary', () => getDailyTaskSummaries(user.id));
  }
};

// Function to get daily task summaries for a particular user
async function getDailyTaskSummaries(userId: number): Promise<string> {
  const toDos = await getTasksForUser(userId);
  return toDos.map(task => `${task.title}: ${task.isCompleted ? 'Completed' : 'Not Completed'}`).join('\n');
}

// Example of how you can implement getTasksForUser
async function getTasksForUser(userId: number): Promise<IToDo[]> {
  // Replace with your actual database query
  return await ToDo.find({ userId: userId });
}

// Function to delete expired or completed tasks
export const deleteExpiredTasks = async (): Promise<void> => {
  const result = await ToDo.deleteMany({ isCompleted: true });
  console.log(`Deleted ${result.deletedCount} completed tasks`);
};

// Function to generate task reports
export const generateTaskReports = async (): Promise<void> => {
  const users = await User.find({});
  for (const user of users) {
    
    console.log(`Sending task summary to user: ${user.email}`);
    
    await sendEmail(user.email,user.password,user.name, 'Tasks Report', () => getTaskReports(user.id));
  }
};

// Function to generate task reports for a particular user
async function getTaskReports(userId: number): Promise<string> {
  const toDos = await getTasksForUser(userId);
  const completedTasks = toDos.filter(task => task.isCompleted);
  const pendingTasks = toDos.filter(task => !task.isCompleted);
  console.log("sending email");
  
  return `${completedTasks.length} completed tasks and ${pendingTasks.length} pending tasks for user ${userId}`;
}

