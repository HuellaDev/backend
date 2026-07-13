export const getMe = async (req, res) => {
  res.json({
    authUser: {
      id: req.user.id,
      email: req.user.email,
    },
    profile: req.profile,
  });
};