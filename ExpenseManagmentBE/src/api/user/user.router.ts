import { Router } from 'express';
import { confirmEmail, me, updatePassword } from './user.controller';
import { isAuthenticated } from '../../utils/auth/authenticated-middleware';
import { list as userList } from '../user/user.controller';

const router = Router();

router.get('/me', isAuthenticated, me);
router.get('/users', userList);
router.post('/email-confirmation', (req, res, next) => {
  confirmEmail(req, res, next).catch(next);
});
router.patch('/updatePassword', isAuthenticated, updatePassword);
export default router;
