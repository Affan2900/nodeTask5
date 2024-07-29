import cron from 'node-cron'
import { generateTaskSummary, deleteExpiredTasks, generateTaskReports } from './taskHandlers';

// Schedule a cron job to send daily task summaries at 8 AM
cron.schedule('0 9 * * *', async () => {
  console.log('Running daily task summary job');
  await generateTaskSummary();
});

// Schedule a cron job to delete expired or completed tasks every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running task cleanup job');
  await deleteExpiredTasks();
});

// Schedule a cron job to generate task reports every Sunday at 11 PM
cron.schedule('0 17 * * 0', async () => {
  console.log('Running weekly task report job');
  await generateTaskReports();
});