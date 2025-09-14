import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    studentId: '',
    gradeLevel: '',
    role: 'STUDENT'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const { signUp } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    
    try {
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        studentId: formData.studentId || null,
        gradeLevel: formData.gradeLevel || null,
        role: formData.role
      });

      if (result.error) {
        setError(result.error);
      } else {
        // Show success message
        setSuccessMessage('Account created successfully! Please log in.');
        
        // Clear form
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          studentId: '',
          gradeLevel: '',
          role: 'STUDENT'
        });

        // Show login prompt after a short delay
        setTimeout(() => {
          setShowLogin(true);
        }, 2000);

        window.location.href = '/login';
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join EduAssess AI</h1>
          <p className="text-white/70">Create your learning account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error message display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Success message display */}
          {successMessage && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-3 text-green-200 text-sm">
              {successMessage}
            </div>
          )}

          {/* Account Type */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">Account Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            >
              <option value="STUDENT" className="bg-gray-800">Student</option>
              <option value="TEACHER" className="bg-gray-800">Teacher</option>
            </select>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Student/Employee ID */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              {formData.role === 'TEACHER' ? 'Employee ID (Optional)' : 'Student ID (Optional)'}
            </label>
            <input
              type="text"
              name="studentId"
              placeholder={formData.role === 'TEACHER' ? 'Employee ID' : 'Student ID'}
              value={formData.studentId}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Grade Level / Department */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              {formData.role === 'TEACHER' ? 'Department' : 'Grade Level'}
            </label>
            <select
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            >
              <option value="" className="bg-gray-800">
                {formData.role === 'TEACHER' ? 'Select Department' : 'Select Grade Level'}
              </option>
              {formData.role === 'STUDENT' ? (
                <>
                  <option value="9" className="bg-gray-800">9th Grade</option>
                  <option value="10" className="bg-gray-800">10th Grade</option>
                  <option value="11" className="bg-gray-800">11th Grade</option>
                  <option value="12" className="bg-gray-800">12th Grade</option>
                </>
              ) : (
                <>
                  <option value="Math" className="bg-gray-800">Math Department</option>
                  <option value="Science" className="bg-gray-800">Science Department</option>
                  <option value="English" className="bg-gray-800">English Department</option>
                  <option value="History" className="bg-gray-800">History Department</option>
                  <option value="Art" className="bg-gray-800">Art Department</option>
                  <option value="Physical Education" className="bg-gray-800">Physical Education</option>
                  <option value="Other" className="bg-gray-800">Other</option>
                </>
              )}
            </select>
          </div>

          {/* Password Fields */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password (minimum 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            Already have an account?{' '}
            <button 
              onClick={() => window.location.reload()} // This will show your login form
              className="text-blue-300 hover:text-blue-200 underline transition-colors bg-transparent border-none cursor-pointer"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;