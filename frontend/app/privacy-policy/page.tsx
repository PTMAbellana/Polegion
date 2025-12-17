"use client";
import { IoChevronBack } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import styles from './privacy.module.css';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className={styles.privacyPage}>
      <div className={styles.privacyContainer}>
        <div className={styles.privacyHeader}>
          <button onClick={() => router.back()} className={styles.backButton}>
            <IoChevronBack />
          </button>
          <h1>Privacy Policy</h1>
        </div>
        
        <div className={styles.privacyBody}>
          <section className={styles.section}>
            <h3>1. Introduction</h3>
            <p>
              <strong>Polegion</strong> is a research and educational platform dedicated to protecting the 
              privacy and security of students, teachers, and all users. This Privacy Policy explains how 
              we collect, use, disclose, and safeguard your information in compliance with the 
              <strong> Philippine Data Privacy Act of 2012 (Republic Act No. 10173)</strong> and 
              <strong> Department of Education (DepEd) guidelines</strong>.
            </p>
            <p className={styles.highlight}>
              <strong>Important:</strong> We will NEVER sell or share your personal information with 
              third parties for marketing purposes. Your data is used exclusively for educational research 
              and platform functionality.
            </p>
          </section>

          <section className={styles.section}>
            <h3>2. Information We Collect</h3>
            <p>
              When you use Polegion, we collect the following types of information:
            </p>
            <p><strong>Personal Information:</strong></p>
            <ul>
              <li>Email address, first name, last name</li>
              <li>Optional: Phone number, gender (these can be skipped during registration)</li>
            </ul>
            <p><strong>Educational Data:</strong></p>
            <ul>
              <li>Learning progress, XP scores, castle completion status</li>
              <li>Assessment results, problem-solving attempts</li>
              <li>Competition participation and performance</li>
            </ul>
            <p><strong>Authentication Data:</strong></p>
            <ul>
              <li>Encrypted passwords and login credentials (managed securely by Supabase)</li>
              <li>Session tokens for secure authentication</li>
            </ul>
            <p><strong>Usage Data:</strong></p>
            <ul>
              <li>Time spent on activities, login timestamps</li>
              <li>Feature usage patterns and navigation behavior</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>3. How We Use Your Information</h3>
            <p>
              Your information is used solely for educational purposes:
            </p>
            <ul>
              <li>Provide access to educational content and track learning progress</li>
              <li>Enable teachers to monitor and support their students within assigned rooms</li>
              <li>Generate progress reports and performance assessments</li>
              <li>Facilitate classroom competitions and collaborative activities</li>
              <li>Improve the platform functionality and learning experience</li>
              <li>Communicate important updates about your account or the platform</li>
              <li>Conduct educational research and usability studies</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>4. Who Can Access Your Information</h3>
            <p><strong>Students:</strong></p>
            <ul>
              <li>Can view their own progress, scores, and learning achievements</li>
              <li>Cannot access other students' personal information</li>
            </ul>
            <p><strong>Teachers:</strong></p>
            <ul>
              <li>Can only access data for students in their own classrooms/rooms</li>
              <li>Cannot view data from other teachers' rooms or classes</li>
              <li>Can generate reports and monitor student progress within their scope</li>
            </ul>
            <p><strong>Parents/Guardians:</strong></p>
            <ul>
              <li>Can request access to their child's learning progress and performance data</li>
              <li>May contact us to exercise data rights on behalf of their minor child</li>
            </ul>
            <p><strong>Administrators:</strong></p>
            <ul>
              <li>Have limited access necessary to maintain and support the platform</li>
              <li>Are bound by strict confidentiality agreements</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>5. Parental Consent (For Students Under 18)</h3>
            <p className={styles.highlight}>
              <strong>IMPORTANT NOTICE FOR PARENTS/GUARDIANS:</strong>
            </p>
            <p>
              Under Philippine law, specifically the Data Privacy Act of 2012 and Child Protection Policy, 
              parental or guardian consent is required for minors (individuals under 18 years of age) to 
              provide personal information.
            </p>
            <p>
              Parents and guardians have the right to:
            </p>
            <ul>
              <li>Review their child's personal information collected by the platform</li>
              <li>Request correction or deletion of their child's data</li>
              <li>Refuse further collection or use of their child's information</li>
              <li>Receive notifications about data practices and policy changes</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>6. Data Security Measures</h3>
            <p>
              We implement industry-standard security measures to protect your information:
            </p>
            <ul>
              <li><strong>Encryption:</strong> All passwords are encrypted and securely hashed (we never store plain-text passwords)</li>
              <li><strong>Secure Transmission:</strong> Data transmission is protected with HTTPS/TLS encryption</li>
              <li><strong>Database Security:</strong> Our database is encrypted at rest and hosted on secure servers</li>
              <li><strong>Access Controls:</strong> Role-based permissions ensure users only access authorized data</li>
              <li><strong>Authentication:</strong> Secure token-based authentication (JWT) for session management</li>
              <li><strong>Regular Updates:</strong> Continuous security monitoring and timely updates</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>7. Your Privacy Rights</h3>
            <p>
              Under the Philippine Data Privacy Act (RA 10173), you have the following rights:
            </p>
            <ul>
              <li><strong>Right to be Informed:</strong> You have the right to know how your data is collected and used</li>
              <li><strong>Right to Access:</strong> Request a copy of your personal information we hold</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal information</li>
              <li><strong>Right to Data Portability:</strong> Request your data in a structured, portable format</li>
              <li><strong>Right to Object:</strong> Object to certain data processing activities</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent at any time (where applicable)</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us using the information provided in Section 10.
            </p>
          </section>

          <section className={styles.section}>
            <h3>8. Third-Party Services</h3>
            <p>
              To provide you with a secure and reliable platform, we use the following trusted third-party services:
            </p>
            <ul>
              <li><strong>Supabase:</strong> For secure authentication, database hosting, and data management 
                  (compliant with international data protection standards)</li>
              <li><strong>Vercel/Railway:</strong> For application hosting and reliable platform delivery</li>
            </ul>
            <p>
              These services have their own privacy policies and security measures that comply with international 
              standards. They are contractually obligated to protect your data and use it only for the purposes 
              specified by Polegion.
            </p>
          </section>

          <section className={styles.section}>
            <h3>9. Data Retention</h3>
            <p>
              We retain your personal information only for as long as necessary to fulfill the educational and 
              research purposes outlined in this policy, or as required by Philippine law.
            </p>
            <ul>
              <li><strong>Active Accounts:</strong> Data is retained while your account is active</li>
              <li><strong>Inactive Accounts:</strong> Accounts inactive for extended periods may be archived</li>
              <li><strong>Account Deletion:</strong> Upon request, we will delete your personal data within a 
                  reasonable timeframe, subject to legal retention requirements</li>
              <li><strong>Research Data:</strong> Anonymized data used in research may be retained for academic purposes</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>10. Contact Information</h3>
            <p>
              If you have any questions, concerns, or wish to exercise your data privacy rights, please contact us:
            </p>
            <p className={styles.contactInfo}>
              <strong>Research Team:</strong> Polegion Development Team<br />
              <strong>Institution:</strong> Cebu Institute of Technology University<br />
              <strong>Email:</strong> privacy@polegion.edu.ph<br />
              <strong>Team Contacts:</strong><br />
              • francisbenedict.chavez@cit.edu<br />
              • paulthomas.abellana@cit.edu<br />
              • ninamargarette.catubig@cit.edu
            </p>
          </section>

          <section className={styles.section}>
            <h3>11. Changes to This Privacy Policy</h3>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, 
              legal requirements, or platform features. We will notify users of any material changes by:
            </p>
            <ul>
              <li>Updating the "Last Updated" date at the bottom of this policy</li>
              <li>Posting a notification on the platform</li>
              <li>Sending an email notification for significant changes (where applicable)</li>
            </ul>
            <p>
              Your continued use of Polegion after changes are posted constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className={styles.section}>
            <h3>12. Educational Compliance</h3>
            <p>
              This platform is designed to comply with:
            </p>
            <ul>
              <li>Data Privacy Act of 2012 (Republic Act No. 10173)</li>
              <li>Department of Education (DepEd) Order No. 40, s. 2022 (Data Privacy Guidelines for the K-12 Program)</li>
              <li>Child Protection Policy of the Philippines</li>
              <li>Cebu Institute of Technology University research ethics guidelines</li>
            </ul>
          </section>

          <p className={styles.footer}>
            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}<br />
            <strong>Version:</strong> 1.0<br />
            This document complies with the Data Privacy Act of 2012 (RA 10173) and Department of Education guidelines.
          </p>
        </div>
        
        <div className={styles.privacyFooter}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <IoChevronBack /> Back
          </button>
        </div>
      </div>
    </div>
  );
}
