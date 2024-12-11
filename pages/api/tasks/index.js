import connectMongo from '../../../lib/mongodb';
import Task from '../../../models/Task';

export default async function handler(req, res) {
  await connectMongo();  // Connect to MongoDB

  if (req.method === 'GET') {
    try {
      const tasks = await Task.find({});
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  } 
  
  else if (req.method === 'POST') {
    try {
      const task = await Task.create(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create task' });
    }
  } 
  
  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
