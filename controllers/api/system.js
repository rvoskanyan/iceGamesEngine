export const switchPlatform = (req, res) => {
  const { platform } = req.query;
  
  res.cookie('platform', platform.toString().toLowerCase());
  res.json({ success: true });
}