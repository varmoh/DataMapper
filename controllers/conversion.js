import express from "express";
import { stringify, parse } from "yaml";
import multer from "multer";
import Papa from "papaparse";
import base64ToText from "../js/util/base64ToText.js";

const router = express.Router();

router.post("/csv_to_json", multer().array("file"), (req, res) => {
  const file = base64ToText(req.body.file);
  const result = Papa.parse(file, { skipEmptyLines: true });
  res.send(result.data);
});

router.post("/yaml_to_json", multer().array("file"), (req, res) => {
  const file = base64ToText(req.body.file);
  const result = parse(file);
  res.send(result);
});

router.post("/json_to_yaml", (req, res) => {
  const result = stringify(req.body);
  res.send({ json: result });
});

router.post("/json_to_yaml_data", (req, res) => {
  const result = stringify(req.body.data);
  res.send({ yaml: result });
});

export default router;
