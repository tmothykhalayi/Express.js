//importing routers from express
import { Router } from "express";
import {query} from 'express-validator';
//importing the schema
const router = Router();
router.get ,('/api/users', (req, res) => {
  const { username, displayname } = req.query; // Extract query parameters

  // If query parameters exist, filter the users
  if (username) {
    const filteredUsers = mockusers.filter(user =>
      user.username.toLowerCase().includes(username.toLowerCase()) // Filter by username
    );
    return res.send(filteredUsers); // Return filtered list
  }

  if (displayname) {
    const filteredUsers = mockusers.filter(user =>
      user.displayname.toLowerCase().includes(displayname.toLowerCase()) // Filter by displayname
    );
    return res.send(filteredUsers); // Return filtered list
  }

  // If no query parameters, return all users
  res.send(mockusers);
});
export default router;
