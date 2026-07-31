import Notification from './notification.model.js';

let clients = [];

// @desc    Establish Server-Sent Events (SSE) connection
// @route   GET /api/notifications/stream
// @access  Private/Admin
export const streamNotifications = (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // Avoid buffering in proxies
  res.setHeader('X-Accel-Buffering', 'no');
  
  res.flushHeaders();

  // Send an initial connected message
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'SSE connection established' })}\n\n`);

  // Add the client to our list
  clients.push(res);

  // When the client closes the connection, remove them
  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
};

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private/Admin
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private/Admin
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    notification.isRead = true;
    await notification.save();
    res.status(200).json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private/Admin
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Internal function to create and broadcast notifications to all connected admins
export const createNotificationAndBroadcast = async (data) => {
  try {
    const newNotification = await Notification.create(data);
    
    clients.forEach(client => {
      client.write(`data: ${JSON.stringify(newNotification)}\n\n`);
    });
  } catch (error) {
    console.error('Error creating/broadcasting notification:', error);
  }
};
