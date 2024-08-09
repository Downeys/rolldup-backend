import express from 'express';
import controller from './controller';

const router = express.Router();

router.post('/exchange-code-for-auth-cookies', controller.exchangeCodeForAuthCookies);
router.post('/exchange-refresh-token-for-auth-cookies', controller.exchangeRefreshTokenForAuthCookies);
router.post('/delete-auth-cookies', controller.removeCookies);
router.get('/me', controller.extractUserDataFromToken);

export default router;
