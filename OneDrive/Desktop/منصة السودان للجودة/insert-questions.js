const mongoose = require('mongoose');
const fs = require('fs');

// نموذج السؤال
const questionSchema = new mongoose.Schema({
  unitId: {
    type: String
