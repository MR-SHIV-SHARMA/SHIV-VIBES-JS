/* eslint-disable @next/next/no-img-element */
// ./components/EmailVerification.js
import Link from "next/link";

const EmailVerification = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 flex items-center justify-center min-h-screen">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <img
          className="mx-auto mb-4"
          src="/Account-verification-email-templates.avif"
          alt="Verification"
          width={150}
          height={150}
        />
        <h2 className="text-2xl text-gray-500 dark:text-gray-200 font-bold mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We have sent an email to youraddress@gmail.com. Please click the link
          in that email to verify your account.
        </p>
        <button className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600">
          <Link href="/login">Login</Link>
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;
