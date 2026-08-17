"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../api/axios';
import Swal from 'sweetalert2';
import { Loader2 } from 'lucide-react';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  width: 'auto',
  padding: '0.5em',
  timerProgressBar: false,
  customClass: {
    title: 'text-sm font-medium m-0',
    popup: 'rounded-lg shadow-sm',
    icon: 'scale-50 my-auto'
  }
});

const CustomSelect = ({ value, onChange, options, placeholder, inputClasses }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className={`${inputClasses} cursor-pointer flex justify-between items-center`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-white' : 'text-white/70'}>
          {value || placeholder}
        </span>
        <svg className={`w-4 h-4 text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-[90] w-full mt-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 py-2 top-full"
          >
            {options.map((opt, idx) => (
              <div
                key={idx}
                className={`px-5 py-3 hover:bg-gray-50 cursor-pointer text-gray-700 text-sm font-medium transition-colors ${idx !== options.length - 1 ? 'border-b border-gray-100' : ''}`}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
              >
                {opt}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const GrievanceForm = ({ formData: cmsData }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    email: '',
    department: '',
    course: '',
    complaint: '',
    grievanceCell: []
  });
  const [errors, setErrors] = useState({});

  const cells = cmsData?.cellOptions || [
    "Student Grievance Cell",
    "Student Grievance Cell",
    "Student Grievance Cell",
    "Student Grievance Cell",
    "Student Grievance Cell",
    "Student Grievance Cell"
  ];

  const departments = cmsData?.departments || ["Department 1", "Department 2"];
  const courses = cmsData?.courses || ["Course 1", "Course 2", "Course 3"];

  const bgImage = cmsData?.backgroundImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop';

  const handleCheckboxChange = (index) => {
    const newCells = [...formData.grievanceCell];
    if (newCells.includes(index)) {
      newCells.splice(newCells.indexOf(index), 1);
    } else {
      newCells.push(index);
    }
    setFormData({ ...formData, grievanceCell: newCells });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.idNumber.trim()) newErrors.idNumber = 'Roll Call No. / Employee Id is required';
    if (!formData.email.trim()) newErrors.email = 'Email Address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.course) newErrors.course = 'Course is required';
    if (!formData.complaint.trim()) newErrors.complaint = 'Complaint details are required';
    if (formData.grievanceCell.length === 0) newErrors.grievanceCell = 'Please select at least one Grievance Cell';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      // Map the selected indices to the actual cell names from the CMS
      const selectedCells = formData.grievanceCell.map(idx => cells[idx]);

      const submissionData = {
        name: formData.name,
        idNumber: formData.idNumber,
        email: formData.email,
        department: formData.department,
        course: formData.course,
        complaint: formData.complaint,
        selectedCells: selectedCells
      };

      await api.post('/grievances', submissionData);

      Toast.fire({
        icon: 'success',
        title: 'Grievance Submitted Successfully'
      });

      // Clear the form
      setFormData({
        name: '',
        idNumber: '',
        email: '',
        department: '',
        course: '',
        complaint: '',
        grievanceCell: []
      });
      setErrors({});

    } catch (error) {
      console.error('Submission error:', error);
      Toast.fire({
        icon: 'error',
        title: 'Submission Failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-white/5 border border-white/20 rounded-xl px-5 py-4 text-white placeholder-white/70 outline-none focus:border-white/50 transition-colors appearance-none";

  return (
    <section className="relative w-full py-16 md:py-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url('${bgImage}')` }}
      >
        <div className="absolute inset-0 bg-primary/55 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Grievance Form
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form
            onSubmit={handleSubmit}
            className="border border-white/20 rounded-3xl p-6 sm:p-10 md:p-14 backdrop-blur-sm bg-white/5 shadow-2xl"
          >
            <div className="space-y-6">

              {/* Row 1 */}
              <div>
                <input
                  type="text"
                  placeholder="Name of student / Faculty / Non - teaching faculty *"
                  className={`${inputClasses} ${errors.name ? 'border-[#ff6b6b] focus:border-[#ff6b6b]' : ''}`}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                />
                {errors.name && <p className="text-[#ff6b6b] text-sm mt-1.5 ml-1 font-semibold drop-shadow-md">{errors.name}</p>}
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    placeholder="Student Roll Call No. / Employee Id *"
                    className={`${inputClasses} ${errors.idNumber ? 'border-[#ff6b6b] focus:border-[#ff6b6b]' : ''}`}
                    value={formData.idNumber}
                    onChange={(e) => {
                      setFormData({ ...formData, idNumber: e.target.value });
                      if (errors.idNumber) setErrors({ ...errors, idNumber: null });
                    }}
                  />
                  {errors.idNumber && <p className="text-[#ff6b6b] text-sm mt-1.5 ml-1 font-semibold drop-shadow-md">{errors.idNumber}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address *"
                    className={`${inputClasses} ${errors.email ? 'border-[#ff6b6b] focus:border-[#ff6b6b]' : ''}`}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                  />
                  {errors.email && <p className="text-[#ff6b6b] text-sm mt-1.5 ml-1 font-semibold drop-shadow-md">{errors.email}</p>}
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <CustomSelect
                    value={formData.department}
                    onChange={(val) => {
                      setFormData({ ...formData, department: val });
                      if (errors.department) setErrors({ ...errors, department: null });
                    }}
                    options={departments}
                    placeholder="Department *"
                    inputClasses={`${inputClasses} ${errors.department ? 'border-[#ff6b6b] focus:border-[#ff6b6b]' : ''}`}
                  />
                  {errors.department && <p className="text-[#ff6b6b] text-sm mt-1.5 ml-1 font-semibold drop-shadow-md">{errors.department}</p>}
                </div>

                <div className="relative">
                  <CustomSelect
                    value={formData.course}
                    onChange={(val) => {
                      setFormData({ ...formData, course: val });
                      if (errors.course) setErrors({ ...errors, course: null });
                    }}
                    options={courses}
                    placeholder="Course *"
                    inputClasses={`${inputClasses} ${errors.course ? 'border-[#ff6b6b] focus:border-[#ff6b6b]' : ''}`}
                  />
                  {errors.course && <p className="text-[#ff6b6b] text-sm mt-1.5 ml-1 font-semibold drop-shadow-md">{errors.course}</p>}
                </div>
              </div>

              {/* Row 4 */}
              <div>
                <textarea
                  placeholder="Complaint: *"
                  rows="4"
                  className={`${inputClasses} resize-none ${errors.complaint ? 'border-[#ff6b6b] focus:border-[#ff6b6b]' : ''}`}
                  value={formData.complaint}
                  onChange={(e) => {
                    setFormData({ ...formData, complaint: e.target.value });
                    if (errors.complaint) setErrors({ ...errors, complaint: null });
                  }}
                ></textarea>
                {errors.complaint && <p className="text-[#ff6b6b] text-sm mt-1.5 ml-1 font-semibold drop-shadow-md">{errors.complaint}</p>}
              </div>

              {/* Checkboxes */}
              <div className="pt-6">
                <h4 className="text-white font-medium mb-6">To Whom: Which Grievance Cell (Tick appropriate box)*</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                  {cells.map((cell, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-5 h-5 border border-white/40 rounded bg-white/5 group-hover:border-white/70 transition-colors">
                        <input
                          type="checkbox"
                          className="opacity-0 absolute w-full h-full cursor-pointer"
                          checked={formData.grievanceCell.includes(idx)}
                          onChange={() => {
                            handleCheckboxChange(idx);
                            if (errors.grievanceCell) setErrors({ ...errors, grievanceCell: null });
                          }}
                        />
                        {formData.grievanceCell.includes(idx) && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        )}
                      </div>
                      <span className="text-white/80 text-sm group-hover:text-white transition-colors select-none">{cell}</span>
                    </label>
                  ))}
                </div>
                {errors.grievanceCell && <p className="text-[#ff6b6b] text-sm mt-2 font-semibold drop-shadow-md">{errors.grievanceCell}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-5 py-2 bg-white text-primary font-bold rounded-[10px] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Grievance'
                  )}
                </button>
              </div>

            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default GrievanceForm;
