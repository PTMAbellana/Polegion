'use client';

import { useRouter } from 'next/navigation';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function TeacherRestrictedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-orange-100 p-6 rounded-full">
            <FaExclamationTriangle className="text-6xl text-orange-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Teacher Features Not Available
        </h1>

        {/* Message */}
        <div className="space-y-4 text-gray-600 mb-8">
          <p className="text-lg">
            This is a <strong>research implementation</strong> focused on student adaptive learning using AI.
          </p>
          <p>
            Teacher features (virtual rooms, student management, content creation) have been temporarily 
            removed to streamline the research study on <strong>MDP-based adaptive difficulty adjustment</strong>.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6 text-left">
            <p className="font-semibold text-blue-800 mb-2">🔬 Research Focus:</p>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              <li>Q-Learning algorithm for difficulty adaptation</li>
              <li>Real-time performance prediction</li>
              <li>Personalized learning paths</li>
              <li>Student engagement optimization</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg"
          >
            Return to Home
          </button>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
          >
            Login as Student
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            For the full version with teacher features, please visit the main application or contact the research team.
          </p>
        </div>
      </div>
    </div>
  );
}
