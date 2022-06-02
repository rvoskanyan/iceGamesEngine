import {startParsingProducts} from "../../services/parsing.js";
import ParsingTask from "../../models/ParsingTask.js";

export const parsingPage = (req, res) => {
  res.render('parsing', {
    layout: 'admin',
    parsing: process.env.PARSING,
  })
}

export const startParsing = (req, res) => {
  startParsingProducts();
  process.env.PARSING = '1';
  res.redirect('/admin/parsing');
}

export const tasksPage = async (req, res) => {
  try {
    const id = res.locals.person._id.toString();
    const taskInWork = await ParsingTask.findOne({status: 'inWork', executor: id}).populate('product').lean();
    
    if (taskInWork) {
      return res.render('listTasks', {
        layout: 'admin',
        taskInWork,
      });
    }
    
    const tasks = await ParsingTask.find({status: 'queue'}).limit(10).populate('product').lean();
    
    res.render('listTasks', {
      layout: 'admin',
      tasks,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin/parsing');
  }
}

export const tasksInWork = async (req, res) => {
  try {
    const {taskId} = req.body;
    const task = await ParsingTask.findById(taskId);
  
    task.status = 'inWork';
    task.executor = res.locals.person._id;
    
    await task.save();
    
    res.redirect('/admin/parsing/tasks');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/parsing/tasks');
  }
}

export const tasksPerformed = async (req, res) => {

}