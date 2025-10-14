"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BiMailSend, BiPhoneCall } from "react-icons/bi";
import { BsMailbox } from "react-icons/bs";
import { PiMailboxFill } from "react-icons/pi";

interface ContactFormInputs {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

const Contact: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInputs>();

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    try {
      await axios.post("http://localhost:3000/api/contacts", data);
      toast.success("Message sent successfully!");
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="bg-gray-900 text-white min-h-[50vh] mb-15 flex flex-col items-center justify-center text-center">
        <h2 className="text-5xl font-semibold mb-6">Get in Touch</h2>
        <p className="text-xl max-w-[45rem] mx-auto">
          Have questions? We'd love to hear from you a message and we'll respond
          as soon as possible.
        </p>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Visit Our Store */}
          <div className="bg-white p-7 rounded-lg border border-gray-200 hover:shadow-lg text-center flex flex-col gap-7">
            <div className="mx-auto mb-2 inline-block p-3 rounded-lg bg-blue-500">
              <span role="img">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-map-pin w-6 h-6 text-white"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </span>
            </div>
            <h3 className="text-lg font-medium">Visit Our Store</h3>
            <p className="text-gray-600">
              665 Market Street
              <br />
              San Francisco, CA 94105
              <br />
              United States
            </p>
          </div>

          {/* Call Us */}
          <div className="bg-white p-7 rounded-lg border border-gray-200 hover:shadow-lg text-center flex flex-col gap-7">
            <div className="mx-auto mb-2 inline-block p-3 rounded-lg bg-green-500">
              <span role="img">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-phone w-6 h-6 text-white"
                  aria-hidden="true"
                >
                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                </svg>
              </span>
            </div>
            <h3 className="text-lg font-medium">Call Us</h3>
            <p className="text-gray-600">
              +1 (415) 000-6660
              <br />
              Mon-Fri: 8AM-6PM PST
            </p>
          </div>

          {/* Email Us */}
          <div className="bg-white p-7 rounded-lg border border-gray-200 hover:shadow-lg text-center flex flex-col gap-7">
            <div className="mx-auto mb-2 inline-block p-3 rounded-lg bg-purple-500">
              <span role="img">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-mail w-6 h-6 text-white"
                  aria-hidden="true"
                >
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                </svg>
              </span>
            </div>
            <h3 className="text-lg font-medium">Email Us</h3>
            <p className="text-gray-600">
              support@falafelverifies.com
              <br />
              We reply within 24h
            </p>
          </div>

          {/* Business Hours */}
          <div className="bg-white p-7 rounded-lg border border-gray-200 hover:shadow-lg text-center flex flex-col gap-7">
            <div className="mx-auto mb-2 inline-block p-3 rounded-lg bg-orange-500">
              <span role="img">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-clock w-6 h-6 text-white"
                  aria-hidden="true"
                >
                  <path d="M12 6v6l4 2"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </span>
            </div>
            <h3 className="text-lg font-medium">Business Hours</h3>
            <p className="text-gray-600">
              Monday-Friday: 8AM-6PM
              <br />
              Saturday: 10AM-4PM
              <br />
              Sunday: Closed
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg max-h-fit">
            <h3 className="text-2xl font-semibold mb-2">Send us a Message</h3>
            <p className="text-gray-600 mb-4">
              Fill out the form and we'll get back to you within 24 hours.
            </p>
            <form className="space-y-7" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex justify-between gap-6">
                <div className="flex-1">
                  <label className="block text-sm mb-2  ">First Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    {...register("name", { required: "Name is required" })}
                    className="w-full bg-gray-100 rounded-lg px-4 py-1.5 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-2  ">Last Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your last name"
                    {...register("name", { required: "Name is required" })}
                    className="w-full bg-gray-100 rounded-lg px-4 py-1.5 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2  ">Email Address *</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Enter a valid email",
                    },
                  })}
                  className="w-full bg-gray-100 rounded-lg px-4 py-1.5 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm mb-2 ">Subject *</label>
                <select
                  {...register("subject")}
                  className="w-full bg-gray-100 rounded-lg px-4 py-1.5 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                >
                  <option value="">Select a subject</option>
                  <option value="support">Support</option>
                  <option value="sales">Sales</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2 ">Message *</label>
                <textarea
                  rows={2.5}
                  placeholder="Tell us how we can help you..."
                  {...register("message", { required: "Message is required" })}
                  className="w-full bg-gray-100 rounded-lg px-4 py-1.5 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 text-white py-1.5 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <p>
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-send inline w-4 h-4 mr-2"
                        aria-hidden="true"
                      >
                        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                        <path d="m21.854 2.147-10.94 10.939"></path>
                      </svg>
                    </span>
                    Send Message
                  </p>
                )}
              </button>
            </form>
          </div>

          {/* FAQs and Support */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Frequently Asked Questions
            </h3>
            <div className=" flex flex-col gap-5">
              <div className="p-4 bg-white rounded-2xl border border-gray-200 flex gap-2 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-circle-question-mark w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path>
                </svg>
                <div className="flex flex-col gap-3">
                  <span className="font-semibold">
                    How do I track my order?
                  </span>
                  <span>
                    Track your order by logging into your account and visiting
                    the Orders section. You'll receive tracking information via
                    email once your order ships.
                  </span>
                </div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-gray-200 flex gap-2 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-circle-question-mark w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path>
                </svg>
                <div className="flex flex-col gap-3">
                  <span className="font-semibold">
                    What is your return policy?
                  </span>
                  <span>
                    We offer a 30-day return policy for all unused items in
                    original packaging. Simply contact our support team to
                    initiate a return.
                  </span>
                </div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-gray-200 flex gap-2 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-circle-question-mark w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path>
                </svg>
                <div className="flex flex-col gap-3">
                  <span className="font-semibold">
                    Do you ship internationally?
                  </span>
                  <span>
                    Yes, we ship worldwide! International shipping costs and
                    delivery times vary by location. Check our shipping page for
                    more details.
                  </span>
                </div>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-gray-200 flex gap-2 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-circle-question-mark w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path>
                </svg>
                <div className="flex flex-col gap-3">
                  <span className="font-semibold">
                    How can I verify product authenticity?
                  </span>
                  <span>
                    All our products come with authenticity certificates. You
                    can also verify products using our verification system on
                    the product page.
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 p-8 rounded-lg border border-blue-200 mt-4 flex flex-col gap-5">
                <h4 className="text-md font-semibold mb-2 flex gap-2 items-end">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide inline lucide-message-circle w-6 h-6 text-blue-600"
                      aria-hidden="true"
                    >
                      <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"></path>
                    </svg>
                  </span>
                  <span>Need Immediate Help?</span>
                </h4>
                <p className="text-sm">
                  Chat with our support team for the instant assistance. We're
                  online Monday through Friday, 9AM to 6PM PST.
                </p>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
                  Start Live Chat
                </button>
              </div>
              <div className="bg-red-50 border border-red-200 p-8 rounded-lg mt-4 flex flex-col gap-4">
                <h4 className="text-md font-semibold">Emergency Support</h4>
                <p className="text-gray-700 text-sm">
                  <span className="block mb-3">
                    For urgent order issues or payment problems:
                  </span>
                  <span className="flex items-center gap-2 font-semibold">
                    <BiPhoneCall className="text-red-700" />{" "}
                    <span className="text-red-700 text-sm">+1 (800)-HELP</span>
                  </span>
                  <span className="flex items-center gap-2 text-red-700 font-semibold">
                    <BiMailSend /> <span> urgent@falafelverifies.com </span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="my-8 text-center  p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-10">Visit Our Store</h3>
          <div className="width-[100%]">
            <iframe
              width="100%"
              height="400"
              src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1600%20Amphitheatre%20Parkway,%20Mountain%20View,%20CA+(Google%20Plex)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
