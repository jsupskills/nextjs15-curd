import connectMongo from '../../../lib/mongodb';
import Task from '../../../models/Task';

export default async function handler(req, res) {
  await connectMongo();  
  // Connect to the database

  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update task' });
    }
  } 
  
  else if (req.method === 'DELETE') {
    try {
      await Task.findByIdAndDelete(id);
      res.status(204).end();  // No Content
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete task' });
    }
  } 
  
  else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
