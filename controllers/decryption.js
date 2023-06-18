import express from 'express';
import aesDecrypt from '../js/decryption/aes.js';
import tripleDesDecrypt from '../js/decryption/triple-des.js';

const router = express.Router();

router.post('/aes', async (req, res) => {
  const result = await aesDecrypt(req.body.cipher, req.body.key, req.body.isObject)
  return res.status(result.error ? 400 : 200).json(result)
})

router.post('/triple-des', async (req, res) => {
  const result = await tripleDesDecrypt(req.body.cipher, req.body.key, req.body.isObject)
  return res.status(result.error ? 400 : 200).json(result)
})

export default router;
