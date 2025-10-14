import React from "react";

const Privacy = () => {
  return (
    <div className="mx-20 px-6 py-16">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-center mb-6">Privacy Policy</h1>
      <p className="text-gray-600 text-center mb-12">
        Your privacy is important to us. This Privacy Policy explains how{" "}
        <span className="font-semibold">Falafel Verifies</span> collects, uses,
        and safeguards your information.
      </p>

      {/* Sections */}
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-gray-600">
            We may collect personal information such as your name, email
            address, phone number, shipping address, and payment details when
            you make a purchase or create an account. We also collect non-personal
            data like browser type and usage statistics for improving our
            services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="text-gray-600">
            We use your information to process orders, provide customer support,
            improve our website, and send promotional offers (only if you
            subscribe). Your data will never be sold to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Sharing of Information</h2>
          <p className="text-gray-600">
            We may share information only with trusted service providers (such
            as payment gateways and shipping companies) to complete your
            purchase. These partners are required to protect your data and use it
            solely for fulfilling services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
          <p className="text-gray-600">
            We use industry-standard encryption and security measures to protect
            your data. While no system is 100% secure, we are committed to
            maintaining a high level of protection.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
          <p className="text-gray-600">
            You may update, correct, or delete your personal data anytime by
            contacting us. You can also unsubscribe from our marketing emails
            using the provided link.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Changes to This Policy</h2>
          <p className="text-gray-600">
            We may update this Privacy Policy occasionally to reflect changes in
            our practices. Any updates will be posted on this page with the
            revised date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Contact Us</h2>
          <p className="text-gray-600">
            If you have questions regarding this Privacy Policy, please contact
            us at{" "}
            <a
              href="mailto:support@falafelverifies.com"
              className="text-purple-600 font-medium hover:underline"
            >
              support@falafelverifies.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
