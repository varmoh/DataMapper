import express from 'express';
import aesEncrypt from '../js/encryption/aes.js';
import tripleDesEncrypt from '../js/encryption/triple-des.js';

const router = express.Router();

router.post('/aes', async (req, res) => {
  const result = await aesEncrypt(req.body.content, req.body.key)
  return res.status(result.error ? 400 : 200).json(result)
})

router.post('/triple-des', async (req, res) => {
  const result = await tripleDesEncrypt(req.body.content, req.body.key)
  return res.status(result.error ? 400 : 200).json(result)
})

export default router;
