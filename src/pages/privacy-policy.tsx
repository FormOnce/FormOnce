import React from 'react'
import RootLayout from '~/layouts/rootLayout'

function PrivacyPolicy() {
  return (
    <RootLayout title="Privacy Policy">
      <div className="prose dark:prose-dark">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg border p-6 shadow-lg">
            <h1 className="mb-4 text-3xl font-bold">Privacy Policy</h1>
            <p className="mb-4">
              This privacy policy explains how [Company Name] collects, uses,
              and protects information in connection with our online form
              building platform.
            </p>

            <h2 className="mb-2 text-2xl font-bold">Information We Collect</h2>
            <p className="mb-4">
              We collect information that you provide directly to us when using
              our platform to build online forms. This may include your name,
              email address, and any other information you choose to include in
              your forms.
            </p>
            <p className="mb-4">
              We also automatically collect certain technical data such as your
              IP address and browser information when you use our services.
            </p>

            <h2 className="mb-2 text-2xl font-bold">Use of Information</h2>
            <p className="mb-4">
              We use the information we collect to provide and improve our form
              building services. We may also use data in an aggregated and
              anonymized manner for analytics purposes.
            </p>

            <h2 className="mb-2 text-2xl font-bold">
              Data Sharing and Disclosure
            </h2>
            <p className="mb-4">
              We do not sell your personal information to third parties. We may
              share data with trusted service providers who assist us in
              operating our platform and services.
            </p>
            <p className="mb-4">
              We may also disclose information if required by law or to protect
              our company, users, or the public.
            </p>

            <h2 className="mb-2 text-2xl font-bold">Data Security</h2>
            <p className="mb-4">
              We use industry-standard security measures to protect the personal
              information submitted to us, both during transmission and once
              received.
            </p>

            <h2 className="mb-2 text-2xl font-bold">Your Rights</h2>
            <p className="mb-4">
              You can access, update, or delete your information by logging into
              your account settings. If you have questions about data privacy,
              please contact us at [privacy@company.com].
            </p>

            <p className="mb-4">
              This privacy policy may be updated from time to time. We will
              notify users of any material changes.
            </p>

            <p>By using our platform, you consent to this privacy policy.</p>
          </div>
        </div>
      </div>
    </RootLayout>
  )
}

export default PrivacyPolicy
