import { Router } from 'express';
import {
  confirmEmail,
  me,
  updatePassword,
  updateProfilePicture,
} from './user.controller';
import { isAuthenticated } from '../../utils/auth/authenticated-middleware';
import { list as userList } from '../user/user.controller';

const router = Router();

router.get('/me', isAuthenticated, me);
router.get('/users', isAuthenticated, userList);
router.post('/email-confirmation', confirmEmail);
router.patch('/updatePassword', isAuthenticated, updatePassword);
router.patch('/update-profile-picture', isAuthenticated, updateProfilePicture);
export default router;
