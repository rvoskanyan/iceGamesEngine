import Achievement from "../../models/Achievement.js";
import {typesAchievements} from "../../utils/constants.js";
import path from "path";
import {__dirname} from "../../rootPathes.js";
import {getExtendFile} from "../../utils/functions.js";
import {v4 as uuidv4} from "uuid";
import {creatingAchievement} from "../../services/achievement.js";

const types = Object.entries(typesAchievements).map(([key, name]) => {
  return {key, name};
})

export const achievementsPage = async (req, res) => {
  try {
    const achievements = await Achievement.find().select(['name']);
    
    res.render('listElements', {
      layout: 'admin',
      title: 'Список достижений',
      section: 'achievements',
      elements: achievements,
      addTitle: "Добавить достижение",
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin');
  }
}

export const addAchievementPage = (req, res) => {
  res.render('addAchievement', {
    layout: 'admin',
    title: 'Добавление достижения',
    types,
  });
}

export const addAchievement = async (req, res) => {
  try {
    const {icon} = req.files;
    const iconExtend = getExtendFile(icon.name);
    const iconName = `${uuidv4()}.${iconExtend}`;
    const achievement = new Achievement({
      icon: iconName,
    });
    
    Object.assign(achievement, req.body);
    await icon.mv(path.join(__dirname, '/uploadedFiles', iconName));
    await achievement.save();
  
    await creatingAchievement(achievement.type, achievement.amount, achievement.id);
    
    res.redirect('/admin/achievements');
  } catch (e) {
    console.log(e);
    res.redirect('/admin/achievements/add')
  }
}

export const editAchievementPage = async (req, res) => {
  try {
    const {id} = req.params;
    const achievement = await Achievement.findById(id);
    
    res.render('addAchievement', {
      layout: 'Admin',
      title: 'Редактирование достижения',
      isEdit: true,
      types: types.map(type => type.key === achievement.type ? {...type, selected: true} : type),
      achievement,
    });
  } catch (e) {
    console.log(e);
    res.redirect('/admin/achievements');
  }
}

export const editAchievement = async (req, res) => {
  const {id} = req.params;
  
  try {
    const achievement = await Achievement.findById(id);
  
    if (req.files) {
      const {
        icon = null,
      } = req.files;
      
      if (icon) {
        const iconExtend = getExtendFile(icon.name);
        const iconName = `${uuidv4()}.${iconExtend}`;
  
        await icon.mv(path.join(__dirname, '/uploadedFiles', iconName));
        achievement.icon = iconName;
      }
    }
  
    Object.assign(achievement, req.body);
  
    await achievement.save();
    res.redirect('/admin/achievements');
  } catch (e) {
    console.log(e);
    res.redirect(`/admin/achievements/edit/${id}`)
  }
}