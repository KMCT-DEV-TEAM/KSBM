import Grievance from './grievance.model.js';

// @desc    Submit a new grievance
// @route   POST /api/grievances
// @access  Public
export const submitGrievance = async (req, res) => {
  try {
    const { name, idNumber, email, department, course, complaint, selectedCells } = req.body;

    const grievance = new Grievance({
      name,
      idNumber,
      email,
      department,
      course,
      complaint,
      selectedCells,
    });

    const createdGrievance = await grievance.save();
    res.status(201).json(createdGrievance);
  } catch (error) {
    console.error('Error submitting grievance:', error);
    res.status(500).json({ message: 'Failed to submit grievance', error: error.message });
  }
};

// @desc    Get all grievances
// @route   GET /api/grievances
// @access  Private/Admin
export const getGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({}).sort({ createdAt: -1 });
    res.status(200).json(grievances);
  } catch (error) {
    console.error('Error fetching grievances:', error);
    res.status(500).json({ message: 'Failed to fetch grievances', error: error.message });
  }
};

// @desc    Update grievance status
// @route   PUT /api/grievances/:id
// @access  Private/Admin
export const updateGrievanceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const grievance = await Grievance.findById(req.params.id);

    if (grievance) {
      grievance.status = status;
      const updatedGrievance = await grievance.save();
      res.status(200).json(updatedGrievance);
    } else {
      res.status(404).json({ message: 'Grievance not found' });
    }
  } catch (error) {
    console.error('Error updating grievance status:', error);
    res.status(500).json({ message: 'Failed to update grievance status', error: error.message });
  }
};
