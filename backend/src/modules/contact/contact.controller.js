import Contact from './contact.model.js';

// @desc    Submit a new contact form
// @route   POST /api/contact/submit
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const newContact = await Contact.create({
      name,
      email,
      phone,
      service,
      message,
    });

    res.status(201).json({ message: 'Contact form submitted successfully', contact: newContact });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private/Admin
export const getContactSubmissions = async (req, res) => {
  try {
    const submissions = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update contact submission status
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['New', 'Read', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const submission = await Contact.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.status = status;
    await submission.save();

    res.status(200).json({ message: 'Status updated successfully', submission });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
