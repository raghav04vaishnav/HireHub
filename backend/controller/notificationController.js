const Notification = require("../model/notificationModel")

const getMyNotifications = async(req,res)=> {
    try {
        const notifications = await Notification.find({userId: req.user.id})
        .populate("jobId", "title")
        .sort({createdAt: -1})

        res.status(200).json({message: "Notificaton fetched successfully", totalNotification: notifications.length, notifications})
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

const markNotificationAsRead = async (req,res)=> {
    try{ 
        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.id
            },
            {
                isRead: true 
            },
            {
                new: true
            }
        )
        if(!notification){
            return res.status(404).json({ message: "Notification not found" })
        }
        res.status(200).json({message: "Notification marked as read", notification})
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

module.exports = {getMyNotifications, markNotificationAsRead}