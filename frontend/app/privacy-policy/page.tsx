export default function PrivacyPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white">
            <h1 className="text-5xl font-bold mb-3">Privacy Policy</h1>
            <p className="text-blue-100 text-lg">
              Your privacy and data security are our top priorities
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-blue-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-xl rounded-2xl p-8 md:p-12 space-y-10 text-gray-700">
          {/* Introduction */}
          <section className="border-l-4 border-blue-600 pl-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="leading-relaxed text-lg">
              Polegion (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting the privacy and security of 
              students, teachers, and all users of our educational platform. This Privacy Policy explains 
              how we collect, use, disclose, and safeguard your information in compliance with the 
              Philippine Data Privacy Act of 2012 (Republic Act No. 10173) and Department of Education 
              (DepEd) guidelines.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <p className="leading-relaxed mb-4 text-lg">
              We collect the following types of information:
            </p>
            <div className="bg-gray-50 rounded-xl p-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong className="text-gray-900">Personal Information:</strong> <span className="text-gray-700">Email address, first name, last name</span></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong className="text-gray-900">Optional Information:</strong> <span className="text-gray-700">Phone number, gender (these are optional and can be skipped)</span></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong className="text-gray-900">Educational Data:</strong> <span className="text-gray-700">Learning progress, XP scores, castle completion status, assessment results, problem-solving attempts, and competition participation</span></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong className="text-gray-900">Authentication Data:</strong> <span className="text-gray-700">Encrypted passwords and login credentials (managed securely by Supabase)</span></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <div><strong className="text-gray-900">Usage Data:</strong> <span className="text-gray-700">Time spent on activities, login timestamps, and feature usage</span></div>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="leading-relaxed mb-3">
              Your information is used solely for educational purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide access to educational content and track learning progress</li>
              <li>To enable teachers to monitor their students&apos; performance within their assigned rooms</li>
              <li>To generate progress reports and assessments</li>
              <li>To facilitate classroom competitions and activities</li>
              <li>To improve the educational experience and platform functionality</li>
              <li>To communicate important updates about the platform</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              <strong>We will never sell or share your personal information with third parties for 
              marketing purposes.</strong>
            </p>
          </section>

          {/* Data Access and Sharing */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who Can Access Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Students:</strong> Can view their own progress, scores, and learning data</li>
              <li><strong>Teachers:</strong> Can only access data for students in their own classrooms/rooms. 
                  Teachers cannot view data from other teachers&apos; rooms</li>
              <li><strong>Administrators:</strong> Have access necessary to maintain and support the platform</li>
              <li><strong>Parents/Guardians:</strong> [TO BE ADDED: Policy for parental access to minor students&apos; data]</li>
            </ul>
          </section>

          {/* Parental Consent */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Parental Consent (For Students Under 18)</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-r-lg">
              <p className="font-semibold text-yellow-900 mb-1">IMPORTANT</p>
              <p className="text-sm text-yellow-800">
                This section requires implementation of parental consent mechanism.
              </p>
            </div>
            <p className="leading-relaxed mt-3">
              For students under 18 years of age, we require verifiable parental consent before collecting 
              personal information. Parents/guardians have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Review their child&apos;s personal information</li>
              <li>Request correction or deletion of their child&apos;s data</li>
              <li>Refuse further collection or use of their child&apos;s information</li>
              <li>Receive notifications about data practices</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Protect Your Information</h2>
            <p className="leading-relaxed mb-3">
              We implement industry-standard security measures:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>All passwords are encrypted and securely hashed (we never store plain-text passwords)</li>
              <li>Data transmission is protected with HTTPS/TLS encryption</li>
              <li>Database is encrypted at rest</li>
              <li>Role-based access controls ensure users only access appropriate data</li>
              <li>Regular security updates and monitoring</li>
              <li>Secure authentication tokens (JWT) for session management</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-r-lg">
              <p className="font-semibold text-yellow-900 mb-1">PENDING</p>
              <p className="text-sm text-yellow-800">
                Specific retention periods need to be defined and implemented.
              </p>
            </div>
            <p className="leading-relaxed mt-3">
              We retain your personal information only for as long as necessary to fulfill the purposes 
              outlined in this policy or as required by law. [Specific retention period to be determined]
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
            <p className="leading-relaxed mb-3">
              Under the Philippine Data Privacy Act, you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your personal information 
                  [Account deletion feature to be implemented]</li>
              <li><strong>Object:</strong> Object to processing of your personal data</li>
              <li><strong>Data Portability:</strong> Request your data in a portable format</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent at any time (where applicable)</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
            <p className="leading-relaxed">
              We use the following trusted third-party services:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Supabase:</strong> For secure authentication and database hosting 
                  (compliant with international data protection standards)</li>
              <li><strong>Vercel/Railway:</strong> For application hosting and delivery</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              These services have their own privacy policies and security measures that comply with 
              industry standards.
            </p>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
            <p className="leading-relaxed">
              We use essential cookies and local storage to maintain your login session and provide 
              core functionality. We do not use cookies for advertising or tracking purposes.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify users of any material 
              changes by posting the new policy on this page and updating the &quot;Last updated&quot; date. 
              Continued use of the platform after changes indicates acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg">
              <p className="font-semibold text-blue-900 mb-1">TO DO</p>
              <p className="text-sm text-blue-800">
                Add actual contact information for data privacy inquiries.
              </p>
            </div>
            <p className="leading-relaxed mt-3">
              If you have any questions or concerns about this Privacy Policy or our data practices, 
              please contact our Data Protection Officer:
            </p>
            <div className="mt-3 bg-gray-100 p-4 rounded">
              <p><strong>Email:</strong> [INSERT EMAIL]</p>
              <p><strong>Address:</strong> [INSERT SCHOOL/ORGANIZATION ADDRESS]</p>
              <p><strong>Data Protection Officer:</strong> [INSERT NAME]</p>
            </div>
          </section>

          {/* DepEd Compliance Notice */}
          <section className="border-t-2 border-gray-200 pt-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">DepEd Compliance</h2>
            <p className="leading-relaxed">
              This platform is designed to comply with Department of Education (DepEd) guidelines 
              for educational technology platforms, including DepEd Order No. 40, s. 2022 
              (Data Privacy Guidelines for the K-12 Program).
            </p>
          </section>

          {/* Implementation Checklist */}
          <section className="bg-gradient-to-br from-red-50 to-orange-50 border-l-4 border-red-500 rounded-r-xl p-8 mt-8">
            <h3 className="text-2xl font-bold text-red-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Implementation Checklist
            </h3>
            <p className="text-sm text-red-800 mb-6">
              The following features mentioned in this policy require implementation:
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                <div className="w-5 h-5 border-2 border-red-400 rounded flex-shrink-0 mt-0.5"></div>
                <span className="text-sm text-red-900">Parental consent mechanism for students under 18</span>
              </div>
              <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                <div className="w-5 h-5 border-2 border-red-400 rounded flex-shrink-0 mt-0.5"></div>
                <span className="text-sm text-red-900">Account deletion feature (right to be forgotten)</span>
              </div>
              <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                <div className="w-5 h-5 border-2 border-red-400 rounded flex-shrink-0 mt-0.5"></div>
                <span className="text-sm text-red-900">Data export functionality</span>
              </div>
              <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                <div className="w-5 h-5 border-2 border-red-400 rounded flex-shrink-0 mt-0.5"></div>
                <span className="text-sm text-red-900">Data retention policy with automatic cleanup</span>
              </div>
              <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                <div className="w-5 h-5 border-2 border-red-400 rounded flex-shrink-0 mt-0.5"></div>
                <span className="text-sm text-red-900">Parental access to minor students&apos; data</span>
              </div>
              <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                <div className="w-5 h-5 border-2 border-red-400 rounded flex-shrink-0 mt-0.5"></div>
                <span className="text-sm text-red-900">Contact information for Data Protection Officer</span>
              </div>
              <div className="flex items-start gap-3 bg-white/60 rounded-lg p-3">
                <div className="w-5 h-5 border-2 border-red-400 rounded flex-shrink-0 mt-0.5"></div>
                <span className="text-sm text-red-900">Legal review of all policy text</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
