"use client";
import { IoChevronBack } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import styles from './terms.module.css';

export default function TermsAndConditionsPage() {
  const router = useRouter();

  return (
    <div className={styles.termsPage}>
      <div className={styles.termsContainer}>
        <div className={styles.termsHeader}>
          <button onClick={() => router.back()} className={styles.backButton}>
            <IoChevronBack />
          </button>
          <h1>Terms and Conditions / Privacy Notice</h1>
        </div>
        
        <div className={styles.termsBody}>
          <section className={styles.section}>
            <h3>1. Research and Development Notice</h3>
            <p>
              <strong>Polegion</strong> is a research and educational platform currently in active development and 
              usability testing. This application is being developed as part of an academic project at 
              <strong> Cebu Institute of Technology University (CIT-U)</strong> for the purpose of studying 
              interactive geometry learning methodologies.
            </p>
            <p className={styles.highlight}>
              <strong>Important:</strong> This platform is NOT a commercial product and is used exclusively 
              for educational research and usability testing purposes.
            </p>
          </section>

          <section className={styles.section}>
            <h3>2. Data Collection and Privacy</h3>
            <p>
              In accordance with the <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong> 
              of the Philippines, we inform you that we collect and process personal data for the following purposes:
            </p>
            <ul>
              <li>Academic research and analysis</li>
              <li>Usability testing and user experience improvement</li>
              <li>Educational performance tracking and assessment</li>
              <li>Platform functionality and user authentication</li>
            </ul>
            <p><strong>Data Collected:</strong></p>
            <ul>
              <li>Personal Information: Name, email address, phone number, gender</li>
              <li>Educational Data: Quiz results, assessment scores, learning progress</li>
              <li>Usage Data: Navigation patterns, time spent on activities, interaction logs</li>
            </ul>
            <p>
              Your data will be stored securely and will only be accessible to authorized research personnel. 
              Data will be anonymized when used in research publications or presentations.
            </p>
          </section>

          <section className={styles.section}>
            <h3>3. Parental/Guardian Consent (For Minors)</h3>
            <p className={styles.highlight}>
              <strong>IMPORTANT NOTICE FOR PARENTS/GUARDIANS:</strong>
            </p>
            <p>
              Under Philippine law, specifically the Data Privacy Act of 2012 and the Child Protection Policy, 
              parental or guardian consent is required for minors (individuals under 18 years of age) to 
              participate in research activities and provide personal information.
            </p>
            <p>
              By registering for this platform, you confirm that:
            </p>
            <ul>
              <li>If you are under 18 years old, your parent or legal guardian has reviewed these terms</li>
              <li>Your parent/guardian consents to your participation in this research study</li>
              <li>Your parent/guardian consents to the collection and processing of your personal data</li>
              <li>You understand this is a research platform for educational purposes</li>
            </ul>
            <p>
              Parents/Guardians may contact the research team at any time to withdraw consent or request 
              data deletion by emailing the team directly.
            </p>
          </section>

          <section className={styles.section}>
            <h3>4. Data Subject Rights</h3>
            <p>
              Under Republic Act No. 10173 (Data Privacy Act of 2012), you have the following rights:
            </p>
            <ul>
              <li><strong>Right to be Informed:</strong> You have the right to know how your data is collected and used</li>
              <li><strong>Right to Access:</strong> You may request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> You may request correction of inaccurate data</li>
              <li><strong>Right to Erasure:</strong> You may request deletion of your data</li>
              <li><strong>Right to Data Portability:</strong> You may request your data in a structured format</li>
              <li><strong>Right to Object:</strong> You may object to certain data processing activities</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>5. Voluntary Participation</h3>
            <p>
              Participation in this research platform is entirely <strong>voluntary</strong>. You may:
            </p>
            <ul>
              <li>Withdraw from the study at any time without penalty</li>
              <li>Request deletion of your account and associated data</li>
              <li>Decline to participate in specific activities or assessments</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h3>6. Data Security and Confidentiality</h3>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against 
              unauthorized access, alteration, disclosure, or destruction, in compliance with RA 10173.
            </p>
          </section>

          <section className={styles.section}>
            <h3>7. Curriculum Acknowledgment</h3>
            <p>
              The educational content and curriculum used in this platform are inspired by the 
              <strong> Grade 5-6 Mathematics Program</strong> at Cebu Institute of Technology University, 
              aligned with DepEd MELCs (Most Essential Learning Competencies).
            </p>
          </section>

          <section className={styles.section}>
            <h3>8. Contact Information</h3>
            <p>
              For questions, concerns, or to exercise your data privacy rights, please contact the research team:
            </p>
            <p className={styles.contactInfo}>
              <strong>Research Team:</strong> Polegion Development Team<br />
              <strong>Institution:</strong> Cebu Institute of Technology University<br />
              <strong>Team Contacts:</strong><br />
              • francisbenedict.chavez@cit.edu<br />
              • paulthomas.abellana@cit.edu<br />
              • ninamargarette.catubig@cit.edu
            </p>
          </section>

          <section className={styles.section}>
            <h3>9. Acceptance</h3>
            <p>
              By checking the "I agree to the Terms and Conditions" box and proceeding with registration, 
              you acknowledge that:
            </p>
            <ul>
              <li>You have read and understood these terms</li>
              <li>You consent to participate in this research study</li>
              <li>You consent to the collection and processing of your personal data as described</li>
              <li>If you are a minor, your parent/guardian has provided consent</li>
              <li>You understand this is a research platform in development</li>
            </ul>
          </section>

          <p className={styles.footer}>
            <strong>Last Updated:</strong> December 12, 2025<br />
            <strong>Version:</strong> 1.0<br />
            This document complies with the Data Privacy Act of 2012 (RA 10173) and Child Protection Policy of the Philippines.
          </p>
        </div>
        
        <div className={styles.termsFooter}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <IoChevronBack /> Back
          </button>
        </div>
      </div>
    </div>
  );
}
