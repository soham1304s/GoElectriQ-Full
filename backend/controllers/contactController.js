import ContactMessage from '../models/ContactMessage.js';

/**
 * @desc    Submit a contact message
 * @route   POST /api/contact
 * @access  Public
 */
export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. We will get back to you soon.',
      data: newMessage,
    });
  } catch (error) {
    console.error('Error submitting contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message,
    });
  }
};

/**
 * @desc    Get all contact messages (Admin)
 * @route   GET /api/contact
 * @access  Private (Admin)
 */
export const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message,
    });
  }
};
