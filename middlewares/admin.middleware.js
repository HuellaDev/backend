export const requireAdmin = (
    req,
    res,
    next
) => {

    if (req.profile.role !== "admin") {
        return res.status(403).json({
            ok:false,
            msg:"Admin only"
        });
    }

    next();
}